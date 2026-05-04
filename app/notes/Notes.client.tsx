"use client";
import { InputEventHandler, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";
import { NoteForm } from "@/components/NoteForm/NoteForm.client";
import { Modal } from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";

import css from "./Notes.module.css";

export default function Notes() {
    const [search, setSearch] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState<number>(1);

    const { data } = useQuery({
        queryKey: ["notes", search, page],
        queryFn: () => fetchNotes(search, page),
        refetchOnMount: false,
        enabled: !!isEnabled,
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setIsEnabled(false);
        setPage(1);
        setSearch(value);
        setIsEnabled(true);
    }, 500);

    const handleSearch: InputEventHandler<HTMLInputElement> = (event) => {
        debouncedSearch((event.target as HTMLInputElement).value);
    };

    const handlePage = (page: number) => {
        setPage(page);
    }

    return (
        <>
            <div className={css.toolbar}>
                <SearchBox onInput={handleSearch} />
                {data && data.totalPages > 0 && (
                    <Pagination
                        page={page}
                        totalPages={data?.totalPages || 0}
                        onPageChange={handlePage}
                    />
                )}
                <button className={css.button} onClick={() => setShowModal(true)}>Create note +</button>
            </div>
            {data && data.notes.length > 0 &&
                <NoteList notes={data?.notes || []} />
            }
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <NoteForm onClose={() => setShowModal(false)} />
                </Modal>
            )}
        </>
    );
}