'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useUserStore } from '@/store/useUserStore';
import api, { withAuth } from '@/lib/api';
import { Product } from '@/types/product';

/**
 * BookmarkHydrator — renders nothing, just seeds the Zustand bookmarkedIds
 * store globally on every page load when the user is signed in.
 *
 * Place this inside <ClerkProvider> in layout.tsx so it runs site-wide.
 */
export default function BookmarkHydrator() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const setBookmarkedIds = useUserStore((s) => s.setBookmarkedIds);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;

        const hydrate = async () => {
            try {
                const config = await withAuth(getToken);
                const res = await api.get(`/api/v1/user/${user.id}/bookmarks`, config);
                // Response: [{ user_id, product: {...}, timestamp }, ...]
                const products: Product[] = (res.data ?? []).map((item: any) => item.product);
                const ids = products
                    .map((p) => p.product_id)
                    .filter((id): id is string => Boolean(id));
                setBookmarkedIds(ids);
            } catch (err) {
                // Non-fatal: hearts will just start empty
                console.warn('BookmarkHydrator: failed to load bookmarks', err);
            }
        };

        hydrate();
    }, [isLoaded, isSignedIn, user, getToken, setBookmarkedIds]);

    return null;
}
