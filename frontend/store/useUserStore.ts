import { create } from 'zustand';

interface UserState {
    user: any | null;
    setUser: (user: any) => void;

    // Bookmark state — Set of product_id strings for O(1) lookup
    bookmarkedIds: Set<string>;
    setBookmarkedIds: (ids: string[]) => void;
    addBookmark: (id: string) => void;
    removeBookmark: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    bookmarkedIds: new Set<string>(),

    // Called once when Saved Items page loads, to seed the full list
    setBookmarkedIds: (ids) => set({ bookmarkedIds: new Set(ids) }),

    // Called on successful POST /bookmarks
    addBookmark: (id) =>
        set((state) => ({
            bookmarkedIds: new Set([...state.bookmarkedIds, id]),
        })),

    // Called on successful DELETE /bookmarks/:id
    removeBookmark: (id) =>
        set((state) => {
            const next = new Set(state.bookmarkedIds);
            next.delete(id);
            return { bookmarkedIds: next };
        }),
}));
