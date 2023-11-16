import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { IDBPDatabase } from 'idb';

const CONTEXT_MENU_WIDTH = 200;
const CONTEXT_MENU_ITEM_HEIGHT = 36;

let initialRender = true;
function App({ initialProps }: { initialProps: InitialProps }) {
  const db: IDBPDatabase = initialProps.db;
  const [sections, setSections] = useState<Section[]>(initialProps.sections);
  const [selectedSection, setSelectedSection] = useState<Section | undefined>(initialProps.selectedSection);
  const [pages, setPages] = useState<Page[] | undefined>(initialProps.pages);
  const [selectedPage, setSelectedPage] = useState<Page | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<ContextMenu>();
  const [content, setContent] = useState(() => {
    let content = localStorage.getItem('content')
    return content === null ? "" : JSON.parse(content)
  })
  const [modal, setModal] = useState(false);

  /**
   * TODO:
   * 
   */

  // Update defaultSectionId and pages when selectedSection changes
  useEffect(() => {
    if (initialRender) return;

    if (!selectedSection) {
      setPages(undefined);
      localStorage.removeItem('defaultSectionId');
      return;
    }

    localStorage.setItem('defaultSectionId', selectedSection.id);
    retrievePages();
  }, [selectedSection]);

  // Update sectionOrder array upon sections changes
  useEffect(() => {
    if (initialRender) return;

    localStorage.setItem('sectionOrder', JSON.stringify(sections.map((section) => section.id)));
  }, [sections]);

  // Update pageOrder array upon pages change
  useEffect(() => {
    if (initialRender) return;

    if (pages && selectedSection) {
      selectedSection.pageOrder =  pages.map(page => page.id);
      updateSection(selectedSection);
    }
  }, [pages])

  // Set initialRender flag
  useEffect(() => { initialRender = false }, []);

  function onContextMenu(e: any, items?: ContextMenuItem[]) {
    e.preventDefault();
    e.stopPropagation();

    if (!items) {
      setContextMenu(undefined)
      return;
    }

    // TODO: Make sure client window fits within screen space (use ResizeObserver?)
    setContextMenu({
      top: e.clientY + 12,
      left: e.clientX,
      items: items as ContextMenuItem[]
    });
  }

  async function retrieveSections() {
    const sections = await db
      ?.transaction('sections')
      .objectStore('sections')
      .getAll() as Section[];

    let sectionOrderStr = localStorage.getItem('sectionOrder');

    if (!sectionOrderStr) {
      setSections(sections);
      return;
    }

    let sectionOrder = JSON.parse(sectionOrderStr) as string[];
    const sectionsMap = new Map<string, Section>(sections.map((section) => [section.id, section]));
    let orderedSections: Section[] = sectionOrder.map(id => sectionsMap.get(id)) as Section[];

    setSections(orderedSections);
  }

  async function retrievePages() {
    const pages = await db
      ?.transaction('pages')
      .objectStore('pages')
      .index('sectionId')
      .getAll(selectedSection?.id) as Page[];

    const pagesMap = new Map<string, Page>(pages.map(page => [page.id, page]));
    let orderedPages = selectedSection?.pageOrder.map(id => pagesMap.get(id)) as Page[];
    orderedPages = orderedPages.filter(page => page);
    setPages(orderedPages);
  }


  function executeContextMenuItem(e: any, action: () => void) {
    action();
  }

  async function deleteSection(id: string) {
    if (selectedSection && selectedSection.id === id) {
      setSelectedSection(undefined);
    }

    await db
      ?.transaction('sections', 'readwrite')
      .objectStore('sections')
      .delete(id);

    await retrieveSections();
  }

  async function addSection(e: any) {
    e.preventDefault();

    const newSection: Section = {
      id: crypto.randomUUID(),
      name: e.target[0].value,
      pageOrder: [],
      date: new Date(),
    }

    await db
      ?.transaction('sections', 'readwrite')
      .objectStore('sections')
      .add(newSection)

    await retrieveSections();
    setModal(false);
  }

  async function updateSection(section: Section) {
    await db.transaction('sections', 'readwrite')
      .objectStore('sections')
      .put(section)
  }

  function onSelectSection(sectionId: string) {
    setSelectedSection(sections.find(section => section.id === sectionId) as Section)
  }

  return (
    <div className="app" onContextMenu={e => onContextMenu(e, undefined)} onClick={e => e.button === 0 && setContextMenu(undefined)}>
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
