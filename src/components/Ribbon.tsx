import { useMemo, useState } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import HomeTab from "./ribbonTabViews/HomeTab";
import InsertTab from "./ribbonTabViews/InsertTab";
import FileTab from "./ribbonTabViews/FileTab";
import DrawTab from "./ribbonTabViews/DrawTab";
import ViewTab from "./ribbonTabViews/ViewTab";

const tabs = [
    'File',
    'Home',
    'Insert',
    'Draw',
    'View',
]

const tabViews: any = {
    FileTab,
    HomeTab,
    InsertTab,
    DrawTab,
    ViewTab,
}

interface RibbonProps {
    state: RibbonState;
    editorRef: React.MutableRefObject<TinyMCEEditor | undefined>;
    setState: React.Dispatch<React.SetStateAction<RibbonState>>;
}

export default function Ribbon(props: RibbonProps) {

    // Tab state
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
    const TabView = useMemo(() => {
        const tabName = tabs[selectedTabIndex];
        return tabViews[`${tabName}Tab`];
    }, [selectedTabIndex])


    return <div className="ribbon">
        <div className="tabs">
            {
                tabs.map((tab, index) =>
                    <div
                        key={index}
                        className={`${tab.toLowerCase()} tab ${selectedTabIndex === index ? 'selected' : ''}`}
                        onClick={() => setSelectedTabIndex(index)}>
                        {tab}
                    </div>
                )
            }
            <div className="select-indicator-wrapper" style={{ transform: `translateX(${selectedTabIndex * 64}px)` }}>
                <div className="select-indicator"></div>
            </div>
        </div>
        <div className="tools">
            {TabView && <TabView {...props} />}
        </div>
    </div>
}