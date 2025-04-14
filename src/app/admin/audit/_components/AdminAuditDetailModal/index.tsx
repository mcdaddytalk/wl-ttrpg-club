"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactJson from "react-json-view";

interface AuditTrailDetailsModalProps {
  metadata: Record<string, unknown> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditTrailDetailsModal({
  metadata,
  isOpen,
  onClose,
}: AuditTrailDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Audit Metadata</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <ReactJson
            src={metadata ?? {}}
            name={null}
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
            collapsed={2}
            style={{ fontSize: "0.85rem" }}
            theme="rjv-default"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}