import { Props } from "tippy.js";

export const ribbonTippyProps: Props = {
    delay: [500, 0],
    placement: 'bottom',
    offset: [0, 12],
    theme: 'white',
    arrow: `
        <svg height="10" width="10" viewBox="0 0 100 100">
            <polygon points="0,100 50,0 100,100 Z" style="fill:white; stroke: white;"></polygon>
        </svg>
        `
} as Props;