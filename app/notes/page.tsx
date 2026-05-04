import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";

import Notes from "./Notes.client";

import css from "./NotesPage.module.css";

export default async function NotesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes"],
        queryFn: () => fetchNotes(),
    });

    return (
        <div className={css.app}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Notes />
            </HydrationBoundary>
        </div>
    );
}
