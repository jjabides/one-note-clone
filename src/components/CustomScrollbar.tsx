import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/custom-scrollbar.css";

const minThumbHeight = 16;

interface CustomScrollbarProps {
    showScroll?: boolean;
}

export default function CustomScrollbar({ children, showScroll = true }: React.PropsWithChildren<CustomScrollbarProps>) {
    const scrollContainerRef = useRef<HTMLElement>();
    const scrollContentRef = useRef<HTMLElement>();
    const [thumbHeight, setThumbHeight] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);
    const resizeObserverRef = useRef<ResizeObserver>(new ResizeObserver(recalculate));

    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [offsetFromThumbTop, setOffsetFromThumbTop] = useState<number>(0);
    const [canScroll, setCanScroll] = useState<boolean>(false);

    useEffect(() => {
        resizeObserverRef.current.observe(scrollContentRef.current as HTMLElement);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', recalculate);


        return () => {
            resizeObserverRef.current.disconnect();
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', recalculate)

        }
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!mouseDown || !scrollContainerRef.current) return;
            const { clientHeight, scrollHeight } = scrollContainerRef.current

            // Get y position based on mouse position relative to page
            const { y } = scrollContainerRef.current.getBoundingClientRect();
            let posY = e.pageY - y - offsetFromThumbTop;

            // clamp new offset
            const thumbOffset = Math.max(0, Math.min(posY, clientHeight - thumbHeight));

            // convert thumb offset to scroll container offset
            const newOffset = (thumbOffset / clientHeight) * scrollHeight;
            scrollContainerRef.current.scrollTo({ top: newOffset })
        }
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        }
    }, [mouseDown, offsetFromThumbTop, thumbHeight])

    function onScroll(e: React.MouseEvent) {
        recalculate();
    }

    function recalculate() {
        if (!scrollContainerRef.current) return;
        const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current
        const visible = scrollHeight > clientHeight;
        setCanScroll(visible);

        // Set thumb height
        if (!visible) {
            setThumbHeight(0);
            setOffsetY(0);
            return;
        }

        const newThumbHeight = (clientHeight / scrollHeight) * clientHeight;
        setThumbHeight(Math.max(newThumbHeight, minThumbHeight));

        // Set offset
        if (newThumbHeight < minThumbHeight) {
            const offset = (scrollTop / scrollHeight) * (clientHeight - (minThumbHeight - newThumbHeight));
            setOffsetY(offset)
        } else {
            const offset = (scrollTop / scrollHeight) * clientHeight;
            setOffsetY(offset)
        }

    }

    function onMouseUp(e: MouseEvent) {
        setMouseDown(false);
    }

    return <div className="custom-scrollbar" style={{ gridTemplateColumns: canScroll ? '1fr auto' : '1fr 0px' }}>
        <div className="scroll-container" ref={scrollContainerRef as any} onScroll={onScroll as any}>
            <div className="scroll-content" ref={scrollContentRef as any}>
                {children}
            </div>
        </div>
        {(mouseDown || showScroll) &&
            <div className="vertical-scrollbar">
                <div className={`scrollbar-thumb ${mouseDown && 'dragging'}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setMouseDown(true);
                        setOffsetFromThumbTop(e.nativeEvent.offsetY)
                    }}
                    style={{
                        height: `${thumbHeight}px`,
                        transform: `translateY(${offsetY}px)`,
                    }}></div>
            </div>}
        {
            mouseDown && <div className="cover"></div>
        }
    </div>
}