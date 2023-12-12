import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import './styles/app.css'
import { IDBPDatabase } from 'idb';
import Modal from './components/Modal';
import NavGroup from './components/NavGroup';
import { Editor, } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from "tinymce";
import Ribbon from './components/Ribbon';
import Notebooks_Icon from "./images/Notebooks.svg";
import Search_Icon from "./images/Search.svg";
import Arrow_No_Tail from "./images/Arrow_No_Tail.svg";
import Notebook_Icon from "./images/Notebook.svg";
import Section_Icon from "./images/Section_Icon.svg";
import { standardColors } from './utilities/colorOptions';
import CustomScrollbar from './components/CustomScrollbar';

const CONTEXT_MENU_WIDTH = 200;
const CONTEXT_MENU_ITEM_HEIGHT = 36;

const MONTH_MAP: any = {
	'Jan': 'January',
	'Feb': 'February',
	'Mar': 'March',
	'Apr': 'April',
	'May': 'May',
	'Jun': 'June',
	'Jul': 'July',
	'Aug': 'August',
	'Sep': 'September',
	'Oct': 'October',
	'Nov': 'November',
	'Dec': 'December',
}

const WEEK_MAP: any = {
	'Mon': 'Monday',
	'Tue': 'Tuesday',
	'Wed': 'Wednesday',
	'Thu': 'Thursday',
	'Fri': 'Friday',
	'Sat': 'Saturday',
	'Sun': 'Sunday',
}

function App({ initialProps }: { initialProps: InitialProps }) {
	const db: IDBPDatabase = initialProps.db;
	const [sections, setSections] = useState<Section[]>(initialProps.sections);
	const [pages, setPages] = useState<Page[]>();
	const [selectedSectionId, setSelectedSectionId] = useState<string>(initialProps.defaultSectionId);
	const [selectedPageId, setSelectedPageId] = useState<string>(initialProps.defaultPageId);

	const selectedSection = useMemo(() => {
		if (!selectedSectionId || !sections) return undefined;
		return sections.find(section => section.id === selectedSectionId);
	}, [selectedSectionId, sections]);

	const selectedPage = useMemo(() => {
		if (!selectedPageId || !pages) return undefined;
		return pages.find(page => page.id === selectedPageId);
	}, [selectedPageId, pages]);

	const [contextMenu, setContextMenu] = useState<ContextMenu>();
	const [modal, setModal] = useState<Modal | null>();

	const [pageContent, setPageContent] = useState<PageContent>();
	const [initialPageContent, setInitalPageContent] = useState<string>();

	// Editor and Ribbon state
	const editorRef = useRef<TinyMCEEditor>();
	const [ribbonState, setRibbonState] = useState<RibbonState>({
		fontFamily: 'Calibri',
		fontSize: '11px',
		bold: false,
		italic: false,
		underline: false,
		hasUndo: false,
		hasRedo: false,
		textSelection: '',
		subscript: false,
		superscript: false,
		strikethrough: false,
		listStyle: '',
	})

	// Update pages when selectedSection changes 
	useEffect(() => {
		if (!selectedSection) {
			setPages(undefined);
			return;
		}

		getPages();
	}, [selectedSection])

	// Set pageContent when selectedPage is set
	useEffect(() => {
		if (!selectedPage) {
			setPageContent(undefined);
			return;
		}

		getPageContent();

		// Preset title value
		const titleEl = document.getElementById('title');
		if (titleEl) {
			titleEl.textContent = selectedPage.name;
			titleEl.focus()
		}

		// Reset ribbon state
		setRibbonState((oldState) => {
			return {
				...oldState,
				hasUndo: false,
				hasRedo: false,
				textSelection: ''
			}
		})
	}, [selectedPage]);

	function updateDefaultSectionId(id?: string) {
		if (!id) {
			localStorage.removeItem('defaultSectionId');
		} else {
			localStorage.setItem('defaultSectionId', id);
		}

		setSelectedSectionId(id as string);
	}

	function updateDefaultPageId(id?: string) {
		if (!id) {
			localStorage.removeItem('defaultPageId');
		} else {
			localStorage.setItem('defaultPageId', id);
		}

		setSelectedPageId(id as string);
	}

	function onContextMenu(e: any, items?: ContextMenuItem[]) {
		e.preventDefault();
		e.stopPropagation();

		if (!items) {
			setContextMenu(undefined)
			return;
		}

		// TODO: Make sure client window fits within screen space (use ResizeObserver?)
		setContextMenu({
			id: crypto.randomUUID(),
			top: e.clientY + 12,
			left: e.clientX,
			items: items as ContextMenuItem[]
		});
	}

	async function getSections() {
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

	async function getPages() {

		const pages = await db
			?.transaction('pages')
			.objectStore('pages')
			.index('sectionId')
			.getAll(selectedSectionId) as Page[];

		const pagesMap = new Map<string, Page>(pages.map(page => [page.id, page]));
		let orderedPages = selectedSection?.pageOrder.map(id => pagesMap.get(id)) as Page[];
		orderedPages = orderedPages.filter(page => page);
		setPages(orderedPages);
	}

	async function getPageContent() {
		let pageContent: PageContent = await db
			.transaction('pageContent')
			.objectStore('pageContent')
			.get(selectedPageId);

		if (!pageContent) {
			pageContent = {
				id: selectedPageId,
				content: ""
			}
		}

		setPageContent(pageContent);
		setInitalPageContent(pageContent.content)

		// Preset page content
		const pageContentEl = document.getElementById('page-content');
		if (pageContentEl) {
			pageContentEl.innerHTML = pageContent?.content as string;
		}
	}

	function executeContextMenuItem(e: any, action: () => void) {
		action();
	}

	async function deleteSection(id: string) {
		if (selectedSection && selectedSection.id === id) {
			updateDefaultSectionId(undefined);
		}

		const sectionToDelete = sections.find(section => section.id === id) as Section;

		// Update sectionOrder
		const ids = [...sections.filter(section => section.id !== id).map(section => section.id)];
		localStorage.setItem('sectionOrder', JSON.stringify(ids));

		// Delete section
		await db
			?.transaction('sections', 'readwrite')
			.objectStore('sections')
			.delete(id);

		// Delete section pages and page content
		for (let pageId of sectionToDelete.pageOrder) {
			db
				?.transaction('pages', 'readwrite')
				.objectStore('pages')
				.delete(pageId);

			db
				?.transaction('pageContent', 'readwrite')
				.objectStore('pageContent')
				.delete(pageId);
		}

		await getSections();
		setModal(null);
	}

	async function addSection(name: string) {
		const newSection: Section = {
			id: crypto.randomUUID(),
			name: name,
			pageOrder: [],
			date: new Date(),
			iconColor: standardColors[Math.floor(Math.random() * standardColors.length)]
		}

		const ids = [...sections.map(section => section.id), newSection.id];
		localStorage.setItem('sectionOrder', JSON.stringify(ids));

		await db
			?.transaction('sections', 'readwrite')
			.objectStore('sections')
			.add(newSection)

		await getSections();
		setModal(null);
	}

	async function addPage() {
		if (!selectedSection || !pages) return;

		let newPage: Page = {
			id: crypto.randomUUID(),
			sectionId: selectedSection.id,
			date: new Date(),
			name: "",
		}

		// Update selected section
		let newSelectedSection: Section = { ...selectedSection, pageOrder: [...selectedSection.pageOrder, newPage.id] }
		await db
			.transaction('sections', 'readwrite')
			.objectStore('sections')
			.put(newSelectedSection);

		// Add page
		await db
			.transaction('pages', 'readwrite')
			.objectStore('pages')
			.add(newPage)

		// Get updated sections
		await getSections();

		// Get updated pages
		await getPages()

		setSelectedPageId(newPage.id);
	}

	async function deletePage(pageId: string) {
		if (!selectedSection || !pages) return;

		if (pageId === selectedPageId) {
			updateDefaultPageId(undefined);
		}

		// Update selected section page order
		const newPageOrder = selectedSection.pageOrder.filter((id) => id !== pageId);
		const newSelectedSection: Section = { ...selectedSection, pageOrder: newPageOrder }

		await db
			.transaction('sections', 'readwrite')
			.objectStore('sections')
			.put(newSelectedSection);

		// Delete page
		await db
			.transaction('pages', 'readwrite')
			.objectStore('pages')
			.delete(pageId)

		// Delete page content
		await db
			.transaction('pageContent', 'readwrite')
			.objectStore('pageContent')
			.delete(pageId);

		// Update sections
		await getSections();

		// Update pages
		await getPages();

		setModal(null);
	}

	let updatePageContentTimer: any;
	async function updatePageContent(content: string) {
		const newPageContent: PageContent = {
			...pageContent as PageContent,
			content,
		}

		if (updatePageContentTimer) {
			clearTimeout(updatePageContentTimer);
		}

		// Throttle update
		updatePageContentTimer = setTimeout(async () => {
			await db
				.transaction('pageContent', 'readwrite')
				.objectStore('pageContent')
				.put(newPageContent)
			updatePageContentTimer = undefined;
		}, 300)

		setPageContent(newPageContent);
	}

	async function updatePageName(name: string) {
		const newPage = { ...selectedPage, name } as Page;

		let page = pages?.find(page => page.id === selectedPage?.id);
		if (page) page.name = name;

		setPages([...pages as Page[]]);

		db
			.transaction('pages', 'readwrite')
			.objectStore('pages')
			.put(newPage);
	}

	async function updateSectionName(section: Section, value: string) {
		section.name = value;

		await db
			?.transaction('sections', 'readwrite')
			.objectStore('sections')
			.put(section)

		await getSections();
		setModal(null);
	}

	function getFormatedDate(date: Date) {
		let [weekDay, month, day, year] = date.toDateString().split(' ');
		weekDay = WEEK_MAP[weekDay];
		month = MONTH_MAP[month];

		let hours = date.getHours() === 12 ? 12 : (date.getHours() % 12);
		let minutes = (date.getMinutes() + "").padStart(2, "0");
		let meridiem = date.getHours() < 12 ? "AM" : "PM";

		return `${weekDay}, ${month} ${day}, ${year} ${hours}:${minutes} ${meridiem}`
	}

	function updateSectionOrder(items: NavGroupItem[]) {
		localStorage.setItem('sectionOrder', JSON.stringify(items.map(section => section.id)));
		setSections(items as Section[]);
	}

	function updatePageOrder(items: NavGroupItem[]) {
		if (!selectedSection) return;
		selectedSection.pageOrder = items.map(item => item.id);

		db
			.transaction('sections', 'readwrite')
			.objectStore('sections')
			.put(selectedSection);

		setPages([...items as Page[]])
	}

	return (
		<div className="app" onContextMenu={e => onContextMenu(e, undefined)} onClick={e => e.button === 0 && setContextMenu(undefined)}>
			<header>
				<div className="header"></div>
				<Ribbon state={ribbonState} setState={setRibbonState} editorRef={editorRef}></Ribbon>
			</header>
			<main>
				<nav>
					<div className="side-nav-bar">
						<div className="side-nav-bar-item btn flex-center selected">
							<img className="size-18-18" src={Notebooks_Icon} draggable="false" />
						</div>
						<div className="side-nav-bar-item btn flex-center">
							<img className="size-20-20" src={Search_Icon} draggable="false" />
						</div>
					</div>
					<div className="notebook-nav">
						<div className="notebook-nav-header flex-center-vertical gap-8 pad-0-8">
							<img className="size-18-18" src={Notebook_Icon} />
							<b>Your Notebook</b>
							<img className="size-10-10" src={Arrow_No_Tail} draggable="false" style={{ rotate: '180deg' }} />
						</div>
						<div className="notebook-nav-body">
							<NavGroup
								selectedItemId={selectedSectionId}
								updateSelectedItemId={updateDefaultSectionId}
								items={sections}
								onContextMenu={(e, item) => onContextMenu(e, [
									{
										name: "Rename",
										icon: "",
										action: () => {
											setModal({
												title: 'Section Name',
												description: 'Enter a section name:',
												input: true,
												inputValue: item.name,
												onSubmit: (value) => updateSectionName(item as Section, value),
												onCancel: () => { setModal(null) }
											})
										}
									},
									{
										name: "Delete",
										icon: "",
										action: () => {
											setModal({
												title: 'Permanently Delete Section',
												description: 'Deleting a section can\'t be undone. Do you want to permanently delete this section and all of its pages?',
												onSubmit: () => { deleteSection(item.id) },
												onCancel: () => { setModal(null) },
												confirmBtnTitle: 'Permanently Delete'
											})
										}
									}
								])}
								addItemButton={{
									title: 'Add Section',
									onClick: () => setModal(
										{
											title: 'Add Section',
											description: 'Enter a Section Name',
											input: true,
											onCancel: () => { setModal(null) },
											onSubmit: addSection,
										})
								}}
								onUpdateOrder={updateSectionOrder}
								backgroundColor={'#f1f1f1'}
							></NavGroup>
							<NavGroup
								selectedItemId={selectedPageId}
								updateSelectedItemId={updateDefaultPageId}
								items={pages}
								onContextMenu={(e, item) => onContextMenu(e, [{
									name: "Delete",
									icon: "",
									action: () => {
										setModal({
											title: 'Delete Page?',
											description: 'Are you sure you want to delete this page?',
											onSubmit: () => { deletePage(item.id) },
											onCancel: () => { setModal(null) },
											confirmBtnTitle: 'Delete'
										})
									}
								}])}
								addItemButton={{
									title: 'Add Page',
									onClick: addPage
								}}
								onUpdateOrder={updatePageOrder}
								backgroundColor={'#f1f1f1'}
								placeHolderItemTitle='Untitled Page'></NavGroup>
						</div>
					</div>
				</nav>
				<section className="content" style={{ backgroundColor: selectedPage ? 'white' : 'rgb(243, 238, 243)' }}>
					<div className="title-cont">
						{selectedPage &&
							<>
								<div className="title" id="title" contentEditable="true" onInput={e => updatePageName(e.currentTarget.textContent as string)}>{ }</div>
								<div className="timestamp">
									<div className="date">{getFormatedDate(selectedPage.date)}</div>
									<div className="time"></div>
								</div>
							</>
						}
					</div>
					<div className="content-body">
						<CustomScrollbar>
							{
								selectedPage &&
								<Editor
									apiKey='oiveiviekj3iuvnfezlpcb3hkw6cqf60akeo58hxw0v56evb'
									initialValue={initialPageContent}
									onEditorChange={e => updatePageContent(e)}
									onSelectionChange={(e, editor) => {
										const { undoManager } = editor;

										setRibbonState((oldState) => {

											let selectedBlocks = editor.selection.getSelectedBlocks();
											let selectedBlock = selectedBlocks[0]
											let listStyle = (selectedBlock ? selectedBlock.parentElement?.style.listStyleType : '') as string;

											return {
												...oldState,
												fontFamily: editor.queryCommandValue('FontName'),
												fontSize: editor.queryCommandValue('FontSize'),
												bold: editor.queryCommandState('Bold'),
												italic: editor.queryCommandState('Italic'),
												underline: editor.queryCommandState('Underline'),
												hasRedo: undoManager.hasRedo(),
												hasUndo: undoManager.hasUndo(),
												textSelection: editor.selection.getContent({ format: 'text' }),
												subscript: editor.queryCommandState('Subscript'),
												superscript: editor.queryCommandState('Superscript'),
												strikethrough: editor.queryCommandState('Strikethrough'),
												listStyle: listStyle
											}
										})
									}}
									onInit={(evt, editor) => {
										editorRef.current = editor
									}}
									init={{
										menubar: false,
										toolbar: false,
										statusbar: false,
										content_style: `
										body {
											font-family: Calibri; 
											font-size: 14px; 
										}
										`,
										plugins: ['lists', 'autoresize'],
										resize: true
									}}></Editor>
							}
						</CustomScrollbar>
					</div>
				</section>
			</main>
			{
				contextMenu &&
				<div key={contextMenu.id}
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
						<div className="overlay" onClick={() => setModal(null)}></div>
						<Modal {...modal}></Modal>
					</>
				)
			}
		</div>
	)
}

export default App
