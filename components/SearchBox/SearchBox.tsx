import css from './SearchBox.module.css';
import type { InputEventHandler } from 'react';

interface SearchBoxProps {
    onInput: InputEventHandler<HTMLInputElement>;
}

export default function SearchBox({ onInput }: SearchBoxProps) {
    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            onInput={onInput}
        />
    )
}