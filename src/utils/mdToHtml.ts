import showdown from "showdown";

const converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    openLinksInNewWindow: true,
});

const mdToHtml = (value: string): string => {
    return converter.makeHtml(value);
};

export { mdToHtml };
