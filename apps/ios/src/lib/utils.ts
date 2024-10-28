function getFirstWord(inputString: string): string | null {
    if (!inputString.trim()) {
        return null;
    }

    const words = inputString.trim().split(/\s+/);

    return words.length > 0 ? words[0] : null;
}


export { getFirstWord }