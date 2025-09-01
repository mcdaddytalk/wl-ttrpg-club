import { useQuery, useMutation } from '@tanstack/react-query';
import fetcher from '@/utils/fetcher';
import { MemberDO } from '@/lib/types/data-objects';
import { useQueryClient } from '../useQueryClient';
import { OauthProvider } from '@/lib/types/custom';

export type MemberAccountSummary = {
    member: MemberDO;
    hasPassword: boolean;
    providers: OauthProvider[];
}

export const ACCOUNT_QK = ['member', 'account', 'summary'] as const;

export const useAccountSummary = () => {
  const qc = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: ACCOUNT_QK,
    queryFn: () => fetcher<MemberAccountSummary>('/api/members/account'),
    // keep data during quick mutations
    placeholderData: (prev) => prev,
  });

  const unlinkProvider = useMutation({
    mutationFn: (identityId: string) =>
      fetcher('/api/members/account/oauth/unlink', {
        method: 'PATCH',
        body: JSON.stringify({ identityId }),
      }),
    onMutate: async (identityId: string) => {
      await qc.cancelQueries({ queryKey: ACCOUNT_QK });
      const prev = qc.getQueryData<MemberAccountSummary>(ACCOUNT_QK);
      if (prev) {
        // Guard: don’t optimistically drop the last provider
        if (prev.providers.length <= 1) {
          throw new Error('You must keep at least one sign-in method.');
        }
        qc.setQueryData<MemberAccountSummary>(ACCOUNT_QK, {
          ...prev,
          providers: prev.providers.filter((p) => p.id !== identityId),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(ACCOUNT_QK, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ACCOUNT_QK });
    },
  });

  const changePassword = useMutation({
      mutationFn: (body: { currentPassword?: string; newPassword: string }) =>
        fetcher('/api/auth/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
});

  // Derived helpers the UI can use without re-deriving
  const providers = summaryQuery.data?.providers ?? [];
  const isLastMethod = providers.length <= 1;

  return {
    summaryQuery,
    providers,
    isLastMethod,
    unlinkProvider,
    changePassword,
  };
};