export const setCaretPosition = (input: HTMLInputElement, position: number) => {
	if (input.setSelectionRange) {
		input.focus()
		input.setSelectionRange(position, position)
	}
}
