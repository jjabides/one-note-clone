import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { IDBPDatabase, openDB } from 'idb'

interface Section {
  id: string;
  name: string;
  pageIds: string[];
  date: Date;
}

interface Page {
  id: string;
  sectionId: string;
  name: string;
  content: string;
}

interface ContextMenu {
  top: number;
  left: number;
  items: ContextMenuItem[];
}

interface ContextMenuItem {
  name: string;
  icon: string;
  action: () => void;
}

const CONTEXT_MENU_WIDTH = 200;
const CONTEXT_MENU_ITEM_HEIGHT = 36;

function App() {
  const [db, setDb] = useState<IDBPDatabase>();

  // Load data from IndexedDB
  useEffect(() => {
    async function fetchData() {
      const db = await openDB('one-note-db', 2, {
        upgrade: (db) => {
          if (!db.objectStoreNames.contains('sections')) {
            const sectionsObjectStore = db.createObjectStore('sections', { keyPath: 'id', autoIncrement: true });
            const id = crypto.randomUUID();
            const pageId = crypto.randomUUID();

            // Add default section
            sectionsObjectStore.add({
              id,
              name: "Section 1",
              pageIds: [pageId],
              date: new Date()
            })

            if (!db.objectStoreNames.contains('pages')) {
              const pagesObjectStore = db.createObjectStore('pages', { keyPath: 'id' });
              pagesObjectStore.createIndex('sectionId', 'sectionId', { unique: false });

              // Add default page
              pagesObjectStore.add({
                id: pageId,
                sectionId: id,
                name: "Page 1",
                content: "",
              })
            }
          }
        },
      });

      // Initialize sections and pages
      let sections = await db
        .transaction('sections')
        .objectStore('sections')
        .getAll();

      sections.sort((a: Section, b: Section) => a.date.getTime() < b.date.getTime() ? -1 : 1);

      const defaultSectionId = localStorage.getItem('defaultSectionId');

      if (defaultSectionId) {
        const selectedSection: Section = sections.find((section: Section) => section.id === defaultSectionId);
        setSelectedSection(selectedSection);
      } else if (sections.length > 0) {
        setSelectedSection(sections[0])
      }

      setSections(sections);
      setDb(db);
    }

    fetchData();
  }, []);


  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [pages, setPages] = useState<Page[] | null>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [content, setContent] = useState(() => {
    let content = localStorage.getItem('content')
    return content === null ? "" : JSON.parse(content)
  })
  const [modal, setModal] = useState(false);

  // Update update defaultSectionId and pages when selectedSection changes
  useEffect(() => {
    if (!db) return;

    if (!selectedSection) {
      setPages(null);
      return;
    }

    localStorage.setItem('defaultSectionId', selectedSection.id);

    async function initializePages() {
      const pages = await db
        ?.transaction('pages')
        .objectStore('pages')
        .index('sectionId')
        .getAll(selectedSection?.id);

      setPages(pages as Page[]);
    }
    initializePages();
  }, [selectedSection]);

  function onContextMenu(e: any, items?: ContextMenuItem[]) {
    e.preventDefault();
    e.stopPropagation();

    if (!items) {
      setContextMenu(null)
      return;
    }

    // TODO: Make sure client window fits within screen space (use ResizeObserver?)
    setContextMenu({
      top: e.clientY + 12,
      left: e.clientX,
      items: items as ContextMenuItem[]
    });
  }

  function executeContextMenuItem(e: any, action: () => void) {
    action();
  }

  async function deleteSection(id: string) {
    if (selectedSection && selectedSection.id === id) {
      setSelectedSection(null);
    }

    await db
      ?.transaction('sections', 'readwrite')
      .objectStore('sections')
      .delete(id);

    const sections = await db
      ?.transaction('sections')
      .objectStore('sections')
      .getAll() as Section[]
    sections.sort((a: Section, b: Section) => a.date.getTime() < b.date.getTime() ? -1 : 1);

    setSections(sections);
  }

  async function addSection(e: any) {
    e.preventDefault();

    await db
      ?.transaction('sections', 'readwrite')
      .objectStore('sections')
      .add({
        id: crypto.randomUUID(),
        name: e.target[0].value,
        pageIds: [],
        date: new Date()
      })

    const sections = await db
      ?.transaction('sections')
      .objectStore('sections')
      .getAll() as Section[]

    sections.sort((a: Section, b: Section) => a.date.getTime() < b.date.getTime() ? -1 : 1);

    setSections(sections)
    setModal(false);
  }

  function onSelectSection(sectionId: string) {
    setSelectedSection(sections.find(section => section.id === sectionId) as Section)
  }

  return (
    <div className="app" onContextMenu={e => onContextMenu(e, undefined)} onClick={e => e.button === 0 && setContextMenu(null)}>
      <header>
      </header>
      <main>
        <nav>
          <div className="sections">
            <h1 className="pad-16">Sections</h1>
            <ul>
              {
                sections.map(({ id, name }) => (
                  <li className={`btn pad-8-16 ${selectedSection && id === selectedSection.id ? 'selected' : ''}`} key={id}
                    onClick={() => onSelectSection(id)}
                    onContextMenu={e => onContextMenu(e, [{
                      name: "Delete",
                      icon: "",
                      action: () => { deleteSection(id) }
                    }])}>
                    {name}
                  </li>
                ))
              }
            </ul>
            <div className="btn pad-12-16" onClick={() => setModal(true)}>Add Section</div>
          </div>
          <div className="pages">
            <h1 className="pad-16">Pages</h1>
            <ul>
              {
                pages && pages.map((page) => (
                  <li className="btn pad-8-16" key={page.id}>{page.name}</li>
                ))
              }
            </ul>
            <div className="btn add-page pad-12-16">Add Page</div>
          </div>
        </nav>
        <section className="content">
          <textarea value={content} onChange={e => setContent(e.target.value)}>
          </textarea>
        </section>
      </main>
      {
        contextMenu &&
        <div
          className="context-menu"
          style={{
            top: contextMenu.top + 'px',
            left: contextMenu.left + 'px'
          }}>
          {
            contextMenu.items.map((item, index) =>
            (
              <div className="item btn pad-8"
                style={{
                  width: CONTEXT_MENU_WIDTH + 'px',
                  height: CONTEXT_MENU_ITEM_HEIGHT + 'px',
                }}
                key={index}
                onClick={e => executeContextMenuItem(e, item.action)}>
                {item.name}
              </div>
            ))
          }
        </div>
      }
      {
        modal && (
          <>
            <div className="overlay" onClick={() => setModal(false)}></div>
            <div className="add-section-modal modal pad-16">
              <h2 className="title">Add Section</h2>
              <form onSubmit={addSection}>
                <div className="description">Enter a Section Name:</div>
                <input type="text" />
              </form>
            </div>
          </>
        )
      }
    </div>
  )
}

export default App
