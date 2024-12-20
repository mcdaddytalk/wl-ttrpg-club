"use client"

import React, { useEffect, useRef } from "react"
import { Spinner } from "./ui/spinner";

type InfiniteScrollProps = {
    isLoadingInitial: boolean;
    isLoadingMore: boolean;
    children: React.ReactNode;
    loadMore: () => void;
}
export default function InfiniteScroll(
    { 
        isLoadingInitial, 
        isLoadingMore, 
        children, 
        loadMore 
    }: InfiniteScrollProps
): React.ReactElement<InfiniteScrollProps, React.JSXElementConstructor<InfiniteScrollProps>> {
    const observerElement = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if (isLoadingInitial || isLoadingMore) return;

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && (!isLoadingMore || !isLoadingInitial)) {
                  loadMore();
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            root: null,
            rootMargin: "100px",
            threshold: 0
        });
        if (observerElement.current)
            observer.observe(observerElement.current as Element);

        return () => {
            observer.disconnect();
        };
    }, [isLoadingInitial, isLoadingMore, loadMore]);

    return (
        <>
            {children}
            <div id="infinite-scroll" ref={observerElement} className="flex flex-col gap-4">
                {isLoadingMore && !isLoadingInitial && (
                    <div className="wrapper flex justify-center">
                        <Spinner />
                    </div>
                )}
            </div>
        </>
        
    )
}