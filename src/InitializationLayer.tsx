import { useEffect, useState } from "react";
import { IDBPDatabase, openDB } from 'idb';
import "./initialization-layer.css";
import App from "./App";

export default function InitializationLayer() {
    const [initialProps, setInitialProps] = useState<InitialProps>();

    // Load data from IndexedDB
    useEffect(() => {
        async function fetchData() {
            const db = await openDB('one-note-db', 1, {
                upgrade: (db) => {
                    if (!db.objectStoreNames.contains('sections')) {
                        const sectionsObjectStore = db.createObjectStore('sections', { keyPath: 'id', autoIncrement: true });
                        const id = crypto.randomUUID();
                        const pageId = crypto.randomUUID();

                        const defaultSection: Section = {
                            id,
                            name: "Section 1",
                            pageOrder: [pageId],
                            date: new Date(),
                        }

                        sectionsObjectStore.add(defaultSection)

                        // Set sectionOrder array in localStorage
                        localStorage.setItem('sectionOrder', JSON.stringify([id]));

                        if (!db.objectStoreNames.contains('pages')) {
                            const pagesObjectStore = db.createObjectStore('pages', { keyPath: 'id' });
                            pagesObjectStore.createIndex('sectionId', 'sectionId', { unique: false });

                            const defaultPage: Page = {
                                id: pageId,
                                sectionId: id,
                                name: "Page 1",
                                content: "",
                                date: new Date(),
                            }

                            pagesObjectStore.add(defaultPage)
                        }
                    }
                },
            });

            // Initialize sections and pages
            let sections = await db
                .transaction('sections')
                .objectStore('sections')
                .getAll();

            // Order sections
            let sectionOrderStr = localStorage.getItem('sectionOrder');
            if (sectionOrderStr) {
                let sectionOrder = JSON.parse(sectionOrderStr) as string[];
                const sectionsMap = new Map<string, Section>(sections.map((section) => [section.id, section]));
                sections = sectionOrder.map(id => sectionsMap.get(id)) as Section[];
                sections = sections.filter(section => section);
            }

            const defaultSectionId = localStorage.getItem('defaultSectionId');
            let selectedSection: Section | undefined = undefined;
            let selectedPage: Page | undefined = undefined;
            let pages: Page[] = [];

            if (defaultSectionId) {
                selectedSection = sections.find((section: Section) => section.id === defaultSectionId);
            } else if (sections.length > 0) {
                selectedSection = sections[0];
                localStorage.setItem('defaultSectionId', selectedSection?.id as string);
            }

            if (selectedSection) {
                pages = await db
                    .transaction('pages')
                    .objectStore('pages')
                    .index('sectionId')
                    .getAll(selectedSection.id) as Page[]
            }

            setInitialProps({
                db,
                sections,
                pages,
                selectedSection,
                selectedPage,
            })
        }

        fetchData();
    }, []);

    return <>
        {
            initialProps
                ? <App initialProps={initialProps}></App>
                :
                <div className="loading-overlay">
                    <h1>Loading...</h1>
                </div>
        }
    </>
}