import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useState, type InputEventHandler } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes } from "../../lib/api";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";

export default function App() {
  const [search, setSearch] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState<number>(1);

  const { data } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData,
    enabled: isEnabled,
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
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox onInput={handleSearch} />
        {/* Пагінація */}
        {data && data.totalPages > 0 && (
          <Pagination
            page={page}
            totalPages={data?.totalPages || 0}
            onPageChange={handlePage}
          />
        )}
        {/* Кнопка створення нотатки */}
        <button className={css.button} onClick={() => setShowModal(true)}>Create note +</button>
      </header>
      {data && data.notes.length > 0 &&
        <NoteList notes={data?.notes || []} />
      }
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NoteForm onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>


  );
}
