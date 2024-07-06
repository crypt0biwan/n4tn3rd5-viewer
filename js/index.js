let natnerds = []
let inscriptions = []
let filtered_natnerds = []
let natnerds_result = []
let filter_choices = []

const itemsPerPage = 1000

const filterForm = document.querySelector('#filter-form')
const filterChoices = document.querySelector('#filter-choices')
const filteredAmount = document.querySelector('#filtered-amount')
const result = document.querySelector('#result')

let numberOfPages = 10
let currentPage = 1

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
})

let params_natnerds = params && params.natnerds ? params.natnerds.split(',') : []

const setActivePage = page => {
    // reset all active states first
    document.querySelectorAll('.page-item').forEach(item=>{
        item.classList.remove('active')
    }
    )
    // add active state to current page
    document.querySelectorAll(`.page-link[href="#${page}"]`).forEach(item=>{
        item.parentNode.classList.add('active')
    }
    )
}

const showItems = page => {
    const startIndex = (page - 1) * itemsPerPage
    const itemsToShow = natnerds_result.slice(startIndex, startIndex + itemsPerPage)

    let html = '<ul>'

    itemsToShow.forEach(item => {
        let { id } = item

        html += `
            <li title="N4TN3RD5 #${id}">
                <div class="natnerd">
                    <img class="img" src="./img/${id}.png" data-bs-toggle="modal" data-bs-target="#modal" data-natnerd-id="${id}">
                    <span class="h6"><a href="./svg/${id}.svg" target="_blank">${id}</a></span>
                    <a href="" style="display: none;" class="buy" target="_blank">buy</a>
                </div>
            </li>`
    })

    html += '</ul>'

    result.innerHTML = html

    setActivePage(page)
}

const setAmount = () => {
    filteredAmount.innerHTML = `Result: ${natnerds_result.length} N4TN3RD5`

    if(params_natnerds.length) {
        filteredAmount.innerHTML += ` <button id="remove_preselected" class="btn btn-danger ms-3">show all N4TN3RD5</button>`

        document.querySelector('#remove_preselected').addEventListener('click', e => {
            e.preventDefault()

            params_natnerds = []
            window.history.pushState('', '', `?natnerds=`)

            filtered_natnerds = natnerds
            natnerds_result = natnerds

            makeFilter()
        })
    }

    updatePaginationNav()
}

const selectFilter = (name, value) => {
    if(value === '') {
        delete filter_choices[name]
    } else {
        filter_choices[name] = value
    }

    filtered_natnerds = natnerds

    document.querySelector('#search').value = ''

    // remove them all
    filterChoices.innerHTML = ''

    Object.keys(filter_choices).forEach(key => {
        let value = filter_choices[key]

        filtered_natnerds = filtered_natnerds.filter(n => {
            let match = Object.keys(n).filter(k => k === key && n[k] === value)

            return match.length
        })

        filterChoices.innerHTML += 
            `<span class="badge text-bg-light m-1">
                ${key}: ${value}
                <i class="ms-1 remove-filter bi bi-x-square-fill" data-key="${key}" data-value="${value}"></i>
            </span>`
    })

    natnerds_result = filtered_natnerds

    document.querySelectorAll('.remove-filter').forEach(item => item.addEventListener('click', e => {
        const el = e.target

        selectFilter(el.getAttribute('data-key'), '')
    }))

    makeFilter()
}

const updatePaginationNav = () => {
    numberOfPages = Math.ceil(natnerds_result.length / itemsPerPage)

    let html = `<nav aria-label="Page navigation">
                    <ul class="pagination text-center">
                        <li class="page-item ${numberOfPages === 1 || currentPage === 1 ? "disabled" : ""}">
                            <a class="page-link" href="#prev">Previous</a>
                        </li>`
    
    if(numberOfPages > 10) {
        html += `<li class="page-item">
            <a class="page-link" href="#1">1</a>
        </li>`
        html += `<li class="page-item">
            <a class="page-link" href="#2">2</a>
        </li>`
        
        if(currentPage > 3) {
            html += `<li class="page-item">
                <a class="page-link">..</a>
            </li>`
            
            if(currentPage > numberOfPages - 3) {
                html += `<li class="page-item">
                    <a class="page-link">..</a>
                </li>`
            }

            if(currentPage > numberOfPages - 3) {
                html += `<li class="page-item">
                    <a class="page-link" href="#${numberOfPages-2}">${numberOfPages-2}</a>
                </li>`
            } else {
                html += `<li class="page-item">
                    <a class="page-link" href="#${currentPage}">${currentPage}</a>
                </li>`
            }

        } else {
            html += `<li class="page-item">
                <a class="page-link" href="#3">3</a>
            </li>`
           
            html += `<li class="page-item">
                <a class="page-link">..</a>
            </li>`
        }

        if(currentPage < numberOfPages-2) {
            html += `<li class="page-item">
                <a class="page-link">..</a>
            </li>`
        }

        html += `<li class="page-item">
            <a class="page-link" href="#${numberOfPages-1}">${numberOfPages-1}</a>
        </li>`
        html += `<li class="page-item">
        <a class="page-link" href="#${numberOfPages}">${numberOfPages}</a>
    </li>`
        
    } else {
        for(let i=1; i<=numberOfPages; i++) {
            html += `<li class="page-item">
                <a class="page-link" href="#${i}">${i}</a>
            </li>`
        }
    }       
        
    html += `<li class="page-item ${numberOfPages === 1 || numberOfPages === currentPage ? "disabled" : ""}">
                <a class="page-link" href="#next">Next</a>
            </li>
        </ul>
    </nav>`

    document.querySelectorAll('.pagination-nav').forEach(nav => {
        nav.innerHTML = html
    })

    document.querySelectorAll('.page-link').forEach(item=>{
        item.addEventListener('click', event=>{
            event.preventDefault();
    
            const page = event.target.getAttribute('href').replace('#', '')
    
            if (page === 'prev') {
                currentPage--
            } else if (page === 'next') {
                currentPage++
            } else {
                currentPage = parseInt(page)
            }
    
            document.querySelectorAll('.page-link[href="#prev"]').forEach(item=>{
                item.parentNode.classList[currentPage === 1 ? 'add' : 'remove']('disabled')
            }
            )
            document.querySelectorAll('.page-link[href="#next"]').forEach(item=>{
                item.parentNode.classList[currentPage === numberOfPages ? 'add' : 'remove']('disabled')
            }
            )
    
            updatePaginationNav()
            showItems(currentPage)
        }
        )
    }
    )    
}

const setupEventHandlers = () => {
    document.querySelector('#search').addEventListener("keyup", (e) => {
        if (e.isComposing || e.keyCode === 229) {
          return;
        }

        natnerds_result = filtered_natnerds.filter(n => n.id.toString().includes(document.querySelector('#search').value))
        setAmount()
        showItems(1)
    })
}

const makeFilter = () => {
    const keys = []
    const options = []

    filterForm.innerHTML = ''
    result.innerHTML = 'Loading data..'
    let filterFormHTML = ''

    Object.keys(natnerds[0]).forEach(key => {
        if(!['id'].includes(key)) {
            filterFormHTML += `<div class="row g-3 mb-2 align-items-center">
                <label for="${key}" class="col-sm-4 col-form-label text-start">${key}</label>
                <div class="col-sm-8">
                    <select class="form-select" id="${key}" aria-label="Default select example">
                        <option value="">- all -</option>
                    </select>
                </div>
            </div>`
        }
    })

    filterForm.innerHTML = filterFormHTML

    filtered_natnerds.forEach(nerd => {
        Object.keys(nerd).forEach(key => {
            const value = nerd[key]

            let f = options.filter(v => v.key === key)

            if(f.length) {
                let val = f[0].values.filter(v => v.value === value)
                
                if(val.length) {
                    val[0].count = val[0].count + 1
                } else {
                    f[0].values.push({
                        value,
                        count: 1
                    })
                }
            } else {
                options.push({
                    key,
                    values: [{
                        value,
                        count: 1
                    }]
                })
            }
        })
    })

    options.forEach(a => {
        if(!['id'].includes(a.key)) {
            let html = ''

            a.values.forEach(b => {

                let has_filter_choice = !!Object.keys(filter_choices).filter(key => {
                    let value = filter_choices[key]

                    return key === a.key && value === b.value
                }).length

                html += `<option ${has_filter_choice ? 'selected' : ''} value="${b.value}">${b.value} (${b.count})</option>`
            })

            document.querySelector(`#${a.key}`).innerHTML += html
        }
    })

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', e => {
            let name = e.target.getAttribute('id')
            let value = e.target.value === "true" ? true : e.target.value === "false" ? false : e.target.value

            if(value !== '') {
                selectFilter(name, value)
            } else {
                filtered_natnerds = natnerds

                selectFilter(name, value)
            }

            setAmount()
            showItems(1)        
        })
    })

    setAmount()
    showItems(1)
}

const setupModal = () => {
    try {
        const modal = document.getElementById('modal')
        if (modal) {
            modal.addEventListener('show.bs.modal', event => {
                const img = event.relatedTarget
                const nerdId = parseInt(img.getAttribute('data-natnerd-id'), 10)

                const nerd = natnerds.find(d => d.id === nerdId)

                if(nerd) {
                    const modalTitle = modal.querySelector('.modal-title')
                    const modalBody = modal.querySelector('.modal-body')

                    const inscription = inscriptions.find(i => i.id === nerdId)

                    let html = '<div class="row">'
                    html += '<div class="col-12 col-md-4 mb-4 mb-md-0">'
                    html += `<img src="./svg/${nerdId}.svg" style="width: 100%" />`

                    html += '<div class="d-grid gap-2 pt-3">'
                    if(inscription) {
                        // html += `<a href="https://magiceden.io/ordinals/item-details/${inscription.inscription}" target="_blank" class="btn btn-magiceden">View on MagicEden</a>`
                    }
                    html += `<a href="./svg-generator?n4tn3rd5=${nerdId}" target="_blank" class="btn btn-primary">Generate High-res pfp img</a>`
                    html += '</div>'

                    html += '</div>'

                    html += '<div class="col-12 col-md-8">'
                    html += `<table class="table table-striped"><tbody>`

                    Object.keys(nerd).forEach(key => {
                        const value = nerd[key]

                        if(!['block', 'block_props'].includes(key) && ![false, null, 0].includes(value)) {
                            html += `<tr><td>${key}</td><td>${value}</td><td></td></tr>`
                        }
                    })

                    html += '</tbody></table>'

                    html += '</div>'

                    html += '</div>'
                    modalTitle.textContent = `N4TN3RD5 #${nerdId}`
                    modalBody.innerHTML = html
                }
            })
        }                
    } catch(e) {
        console.log(e)
    }
}

const init = async () => {
    try {
        natnerds = await fetch('./data/traits.json?ts=1720190682929').then(res=>res.json()).catch(e=>console.log(e))
        inscriptions = await fetch('./data/inscriptions.json?ts=1720190682929').then(res=>res.json()).catch(e=>console.log(e))

        if(params_natnerds.length) {
            filtered_natnerds = natnerds.filter(n => params_natnerds.includes(n.id.toString()))
        } else {
            filtered_natnerds = natnerds
        }

        natnerds_result = filtered_natnerds

        makeFilter()
        setupEventHandlers()

        // load first page by default
        // showItems(currentPage)

        setupModal()
    } catch(e) {
        console.log(e)
    }
}

init()