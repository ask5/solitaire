class Layout {

    constructor(pattern) {
        this.pattern = pattern;
        this.create();
    }

    create() {
        let panel = new Panel(this.pattern['name']);
        for (let r = 0; r < this.pattern['cells'].length; r++) {
            let row = new Row();
            for (let c = 0; c < this.pattern['cells'][r].length; c++) {
                let cell_value = this.pattern['cells'][r][c];
                if (cell_value !== null) {
                    let cell = new Cell(r, c);
                    let cn = new CellNumber((r + 1).toString() + (c + 1).toString());
                    cell.append(cn.element);
                    let hole = new Hole();
                    if (cell_value === 1) {
                        let peg = new Peg();
                        hole.put_peg(peg);
                    }
                    cell.add_hole(hole);
                    row.add_cell(cell);
                }
            }
            panel.add_row(row);
        }
        this.panel = panel;
    }
}


class Panel {
    constructor(pattern_name) {
        this.element = document.createElement("div");
        this.element.setAttribute('id', 'board');

        let name = document.createElement("span");
        name.innerText = pattern_name;
        name.setAttribute('class', 'pattern_name');
        this.element.append(name);

        this.rows = []
    }

    add_row(row) {
        this.rows.push(row);
        this.element.appendChild(row.element);
    }

    get_cell(row, column) {
        let cell = this.rows[row].cells.find(function (cell) {
            return cell.column == column;
        })
        return cell;
    }

    get peg_count() {
        return this.calculate_peg_count();
    }

    calculate_peg_count() {
        let p = 0;
        for (let r = 0; r < this.rows.length; r++) {
            for (let c = 0; c < this.rows[r].cells.length; c++) {
                if (!this.rows[r].cells[c].hole.empty)
                    p++;
            }
        }
        return p;
    }
}

class Row {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add('row');
        this.cells = [];
    }

    add_cell(cell) {
        this.cells.push(cell);
        this.element.appendChild(cell.element);
    }
}

class Cell {
    constructor(r, c) {
        this.row = r;
        this.column = c;
        this.element = document.createElement("div");
        this.element.classList.add('cell');
        this.element.setAttribute('onclick', 'make_move(' + r + ',' + c + ');');
        this.hole = null;
    }

    add_hole(hole) {
        this.hole = hole;
        this.append(hole.element);
    }

    append(element) {
        this.element.appendChild(element);
    }
}

class CellNumber {
    constructor(content) {
        this.element = document.createElement("span");
        this.element.innerText = content;
        this.element.setAttribute('class', 'cell_number');
    }
}

class Hole {

    constructor() {
        this.element = document.createElement("div");
        this.element.setAttribute('class', 'hole');
        this.empty = true;
    }

    put_peg(peg) {
        this.peg = peg;
        this.empty = false;
        this.element.appendChild(peg.element);
    }

    remove_peg() {
        let p = this.peg;
        this.flush();
        return p;
    }

    flush() {
        this.empty = true;
        this.peg = null;
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    select() {
        this.element.parentNode.classList.add('highlight');
    }

    unselect() {
        this.element.parentNode.classList.remove('highlight');
    }
}

class Peg {
    constructor() {
        this.element = document.createElement("div");
        this.element.setAttribute('class', 'peg black');
    }
}
