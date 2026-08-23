class TagInput {
    constructor({ inputId, datalistId, listId, hiddenInputId, suggestAPI, suggestKey }) {
        this.input = document.getElementById(inputId);
        if (!this.input) return;

        this.container = this.input.closest('.tag-input-container') || document.body;
        if (getComputedStyle(this.container).position === 'static') this.container.style.position = 'relative';
        this.container.style.overflow = 'visible';

        this.base = inputId.replace(/Input$/, '');

        this.list =
            document.getElementById(listId) ||
            this.container.querySelector('ul') ||
            (() => {
                const ul = document.createElement('ul');
                ul.id = `${this.base}List`;
                this.container.insertBefore(ul, this.input);
                return ul;
            })();

        this.suggestionContainer =
            document.getElementById(`${this.base}Suggestions`) || // will match categorySuggestions
            document.getElementById(inputId.replace('Input', 'Suggestions')) ||
            (() => {
                const div = document.createElement('div');
                div.id = `${this.base}Suggestions`;
                div.className = 'suggestion-list';
                div.style.display = 'none';
                return div;
            })();

        // Append to container only if it's not already in DOM
        if (!this.suggestionContainer.parentElement) {
            this.container.appendChild(this.suggestionContainer);
        }

        this.hiddenInput = document.getElementById(hiddenInputId) || document.getElementById(this.base);
        this.datalist = document.getElementById(datalistId) || document.getElementById(`${this.base}Datalist`);
        this.suggestAPI = suggestAPI || null;
        this.suggestKey = suggestKey || null;

        this.selectedTags = [];
        this.allSuggestions = [];

        this.init();
        if (window.DEBUG_TAGINPUT) {
            console.log(`[TagInput] init: ${this.base}`, {
                input: !!this.input, list: !!this.list, sugg: !!this.suggestionContainer
            });
        }
    }

    getDummySuggestions() {
        return this.base.startsWith('category')
            ? ['CAT001 - Electronics', 'CAT002 - Furniture', 'CAT003 - Stationery', 'CAT004 - Hardware', 'CAT005 - Cleaning', 'CAT006 - IT Equipment', 'CAT007 - Safety', 'CAT008 - Packaging']
            : ['ITM1001 - Laptop', 'ITM1002 - Desktop', 'ITM1003 - Mouse', 'ITM1004 - Keyboard', 'ITM1005 - Monitor', 'ITM1006 - Printer', 'ITM1007 - UPS', 'ITM1008 - Router'];
    }

    async fetchAllSuggestions() {
        if (!this.suggestAPI) return this.getDummySuggestions();
        try {
            const res = await fetch(`${this.suggestAPI}?q=`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (Array.isArray(data)) {
                if (typeof data[0] === 'string') return data;
                if (this.suggestKey) return data.map(d => d?.[this.suggestKey]).filter(Boolean);
            }
        } catch (_) {
            // fall back
        }
        return this.getDummySuggestions();
    }

    extractCode(s) { return (s || '').includes(' - ') ? s.split(' - ')[0] : s; }

    highlight(text, q) {
        if (!q) return text;
        const i = text.toLowerCase().indexOf(q.toLowerCase());
        if (i < 0) return text;
        return `${text.slice(0, i)}<strong>${text.slice(i, i + q.length)}</strong>${text.slice(i + q.length)}`;
    }

    showSuggestions(query) {
        const q = (query || '').trim().toLowerCase();
        const items = this.allSuggestions
            .filter(s => s.toLowerCase().includes(q) && !this.selectedTags.includes(this.extractCode(s)))
            .slice(0, 12);

        const box = this.suggestionContainer;
        box.innerHTML = '';
        if (!items.length) { box.style.display = 'none'; return; }

        items.forEach(s => {
            const div = document.createElement('div');
            div.className = 'tag-suggestion';
            div.style.cssText = 'padding:8px;cursor:pointer';
            div.innerHTML = this.highlight(s, q);
            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.addTag(this.extractCode(s));
                this.input.value = '';
                this.hideSuggestions();
            });
            box.appendChild(div);
        });

        // Position under input (relative to container)
        const r = this.input.getBoundingClientRect();
        const rc = this.container.getBoundingClientRect();
        box.style.display = 'block';
        box.style.position = 'absolute';
        box.style.left = `${r.left - rc.left}px`;
        box.style.top = `${r.bottom - rc.top}px`;
        box.style.width = `${this.input.offsetWidth}px`;
        box.style.maxHeight = '200px';
        box.style.overflowY = 'auto';
        box.style.background = '#fff';
        box.style.border = '1px solid #ddd';
        box.style.zIndex = '1000';
    }

    hideSuggestions() { this.suggestionContainer.style.display = 'none'; }

    addTag(raw) {
        const v = this.extractCode(String(raw || '').trim());
        if (!v || this.selectedTags.includes(v)) return;
        this.selectedTags.push(v);
        this.renderTags();
        if (this.hiddenInput) this.hiddenInput.value = JSON.stringify(this.selectedTags);
        if (window.DEBUG_TAGINPUT) console.log('[TagInput] addTag', this.base, v);
    }

    renderTags() {
        this.list.innerHTML = '';
        this.selectedTags.forEach(tag => {
            const li = document.createElement('li');
            li.className = 'tag';
            li.innerHTML = `<span>${tag}</span> <button type="button" aria-label="Remove" style="border:none;background:transparent;cursor:pointer;font-weight:bold">×</button>`;
            li.querySelector('button').addEventListener('click', () => {
                this.selectedTags = this.selectedTags.filter(t => t !== tag);
                this.renderTags();
                if (this.hiddenInput) this.hiddenInput.value = JSON.stringify(this.selectedTags);
            });
            this.list.appendChild(li);
        });
    }

    async init() {
        this.allSuggestions = await this.fetchAllSuggestions();

        if (this.datalist) {
            this.datalist.innerHTML = '';
            this.allSuggestions.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                this.datalist.appendChild(opt);
            });
        }

        // Show dropdown on click, focus, and while typing
        this.input.addEventListener('click', () => this.showSuggestions(this.input.value));
        this.input.addEventListener('focus', () => this.showSuggestions(this.input.value));
        this.input.addEventListener('input', () => this.showSuggestions(this.input.value));

        // Enter adds tag, never submits
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                this.addTag(this.input.value);
                this.input.value = '';
                this.hideSuggestions();
            }
        });

        // Click outside -> hide
        document.addEventListener('mousedown', (e) => {
            if (e.target !== this.input && !this.suggestionContainer.contains(e.target)) this.hideSuggestions();
        });
    }
}

function initializeTagInputs(fields) {
    if (!Array.isArray(fields)) return;
    fields.forEach(f => {
        if (f.type === 'tagInput') {
            new TagInput({
                inputId: `${f.name}Input`,
                datalistId: `${f.name}Datalist`,
                listId: `${f.name}List`,
                hiddenInputId: f.name,
                suggestAPI: f.suggestAPI || null,
                suggestKey: f.suggestKey || null
            });
        }
    });
}

// Init after dynamic renderer
document.addEventListener('formRendered', (e) => {
    initializeTagInputs((e.detail && e.detail.fields) || []);
});

// Prevent implicit submit on Enter from tag inputs
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target?.classList?.contains('tag-input-field')) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Category Enter -> add <li> to #categoryList (no submit)
(function bindCategoryEnter() {
    function bind() {
        const input = document.getElementById('categoryInput');
        const list = document.querySelector('#categoryContainer #categoryList') || document.getElementById('categoryList');
        const hidden = document.getElementById('category');

        if (!input || !list) return;

        const getTags = () => {
            try { return JSON.parse(hidden?.value || '[]'); } catch { return []; }
        };
        const setTags = (tags) => { if (hidden) hidden.value = JSON.stringify(tags); };

        const addTag = (val) => {
            const v = String(val || '').trim();
            if (!v) return;
            const tags = getTags();
            if (tags.includes(v)) return;

            tags.push(v);
            setTags(tags);

            const li = document.createElement('li');
            li.className = 'tag';
            li.innerHTML = `<span>${v}</span> <button type="button" class="remove-tag" aria-label="Remove">×</button>`;
            li.querySelector('.remove-tag').addEventListener('click', () => {
                const updated = getTags().filter(t => t !== v);
                setTags(updated);
                li.remove();
            });
            list.appendChild(li);
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                addTag(input.value);
                input.value = '';
                const sug = document.getElementById('categorySuggestions');
                if (sug) sug.innerHTML = '';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
