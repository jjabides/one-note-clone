interface InitialProps {
    db: IDBPDatabase;
    sections: Section[];
    pages: Page[];
    selectedSection?: Section;
    selectedPage?: Page;
}