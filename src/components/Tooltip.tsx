import { useEffect, useRef } from "react";
import tippy, { Props } from "tippy.js";

interface TooltipProps {
    props: Props;
}

export default function Tooltip({ children, props }: React.PropsWithChildren<TooltipProps>) {
    const spanRef = useRef<HTMLElement>()
    useEffect(() => {
        const instance = tippy(spanRef.current as HTMLElement, props)
        return () => {
            instance.destroy();
        }
    })
    return <span ref={spanRef as any}>
        {children}
    </span>
}