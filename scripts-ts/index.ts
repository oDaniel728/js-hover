const hoverDiv = document.createElement('div') as HTMLDivElement
hoverDiv.classList.add("bordered", "op-trans", "abs", "hover-tooltip")
hoverDiv.style.pointerEvents = 'auto' 

document.body.appendChild(hoverDiv)

let isMouseOverHoverDiv = false
let isMouseOverElement = false
let currentTarget: HTMLElement | null = null

function show(element: HTMLElement): void {
    element.style.opacity = '1'
}

function hide(element: HTMLElement): void {
    
    if (!isMouseOverHoverDiv && !isMouseOverElement) {
        element.style.opacity = '0'
        currentTarget = null
    }
}

hoverDiv.addEventListener("mouseenter", () => {
    isMouseOverHoverDiv = true
})

hoverDiv.addEventListener("mouseleave", () => {
    isMouseOverHoverDiv = false
    setTimeout(() => {
        if (!isMouseOverElement && !isMouseOverHoverDiv) {
            hoverDiv.style.opacity = '0'
            currentTarget = null
        }
    }, 100)
})

const hovers = document.querySelectorAll<HTMLParagraphElement>('.hover')

hovers.forEach((e) => {
    e.classList.add('hoverable', 'select-none')
    
    const hasFollow = e.hasAttribute('follow')

    e.addEventListener("mouseenter", (ev) => {
        isMouseOverElement = true
        currentTarget = e
        
        hoverDiv.innerHTML = e.getAttribute("hover") || ""
        show(hoverDiv)
        
        if (hasFollow) {
            
            hoverDiv.style.removeProperty('position')
            hoverDiv.style.removeProperty('top')
            hoverDiv.style.removeProperty('left')
            hoverDiv.style.removeProperty('transform')
        } else {
            
            const rect = e.getBoundingClientRect()
            
            
            const tooltipHeight = hoverDiv.offsetHeight
            const tooltipWidth = hoverDiv.offsetWidth
            
            let top = rect.top - tooltipHeight - 4
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
            
            
            if (top < 10) top = rect.bottom + 10 
            if (left < 10) left = 10
            if (left + tooltipWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltipWidth - 10
            }
            
            hoverDiv.style.position = 'fixed'
            hoverDiv.style.top = `${top-10}px`
            hoverDiv.style.left = `${left}px`
            hoverDiv.style.transform = 'none'
        }
    })

    e.addEventListener("mouseleave", (ev) => {
        isMouseOverElement = false
        
        
        const relatedTarget = ev.relatedTarget as Node
        if (relatedTarget !== hoverDiv && !hoverDiv.contains(relatedTarget)) {
            setTimeout(() => {
                hide(hoverDiv)
            }, 100)
        }
    })
})


document.addEventListener("mousemove", (ev) => {
    if (!currentTarget) return
    
    const hasFollow = currentTarget.hasAttribute('follow')
    
    if (hasFollow) {
        
        hoverDiv.style.left = `calc(${ev.clientX}px + var(--hover-offset-x, 20px))`
        hoverDiv.style.top = `calc(${ev.clientY}px + var(--hover-offset-y, 20px))`
        
        
        hoverDiv.style.opacity = '1'
    }
})

window.addEventListener('resize', () => {
    if (currentTarget && !currentTarget.hasAttribute('follow')) {
        
        const rect = currentTarget.getBoundingClientRect()
        const tooltipHeight = hoverDiv.offsetHeight
        const tooltipWidth = hoverDiv.offsetWidth
        
        let top = rect.top - tooltipHeight - 10
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
        
        
        if (top < 10) top = rect.bottom + 10
        if (left < 10) left = 10
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10
        }
        
        hoverDiv.style.top = `${top}px`
        hoverDiv.style.left = `${left}px`
    }
})