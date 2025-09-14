exports.makeExcerpt = (text, maxLen = 200) => {
    if (!text) return "";
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trim().replace(/\s+\S*$/, "") + "...";
};
