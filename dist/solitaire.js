class Board {

  pattern = null;
  moves = [];

  constructor(container) {
    this.container = container;
  }

  setup() {
    if (this.pattern) {
      this.create_layout();
    }
  }

  reset() {
    this.moves = [];
    this.flush_container();
    this.setup();
    this.from_cell = null;
  }

  flush_container() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  create_layout() {
    this.layout = new Layout(this.pattern);
    this.container.appendChild(this.layout.panel.element);
  }

  make_move(row, column) {

    let move = null;
    let clicked_cell = this.layout.panel.get_cell(row, column);

    if (clicked_cell.hole.empty && this.from_cell) {

      let middle_cell_row = -1;
      let middle_cell_column = -1;

      let dr = Math.abs(clicked_cell.row - this.from_cell.row);
      let dc = Math.abs(clicked_cell.column - this.from_cell.column);

      let pass = (dr === 0 || dr === 2) && (dc === 0 || dc === 2)
      
      if (!this.pattern.diagonal_allowed)
        pass = pass && (dc != dr);

      if (pass) {
        middle_cell_row = (this.from_cell.row + clicked_cell.row) / 2;
        middle_cell_column = (this.from_cell.column + clicked_cell.column) / 2;
      }

      if (middle_cell_row > -1 && middle_cell_column > -1) {

        let middle_cell = this.layout.panel.get_cell(middle_cell_row, middle_cell_column);

        if (!middle_cell.hole.empty) {

          // successful move. log it
          move = {
            'from_row': this.from_cell.row,
            'from_column': this.from_cell.column,
            'to_row': clicked_cell.row,
            'to_column': clicked_cell.column,
            'middle_row': middle_cell.row,
            'middle_column': middle_cell.column
          };
          this.moves.push(move);

          // remove peg from from_cell and put it in clicked_cell. 
          // remove peg from middle_cell.
          let from_peg = this.from_cell.hole.remove_peg();
          middle_cell.hole.remove_peg();
          clicked_cell.hole.put_peg(from_peg);
          this.from_cell.hole.unselect();
          this.from_cell = null;
        }
      }
    } else {
      if (this.from_cell) {
        this.from_cell.hole.unselect();
      }
      if (!clicked_cell.hole.empty) {
        clicked_cell.hole.select();
        this.from_cell = clicked_cell;
      }
    }
    return move;
  }

  undo() {
    let last_move = this.moves.pop();
    if (last_move) {

      let to_cell = this.layout.panel.get_cell(last_move['to_row'], last_move['to_column']);
      let peg = to_cell.hole.remove_peg();

      let from_cell = this.layout.panel.get_cell(last_move['from_row'], last_move['from_column']);
      from_cell.hole.put_peg(peg);

      let middle_cell = this.layout.panel.get_cell(last_move['middle_row'], last_move['middle_column']);
      let new_peg = new Peg();
      middle_cell.hole.put_peg(new_peg);
    }
    return last_move;
  }

  replay(callback) {
    let delay = 2000;
    if (this.moves.length > 0) {

      this.flush_container();
      this.setup();

      let m = 0;
      let max = this.moves.length;
      let self = this;

      function play_next_move() {
        setTimeout(function () {

          if (self.moves.length > 0) {
            let move = self.moves[m];

            let from_cell = self.layout.panel.get_cell(move['from_row'], move['from_column']);
            let peg = from_cell.hole.remove_peg();

            let to_cell = self.layout.panel.get_cell(move['to_row'], move['to_column']);
            to_cell.hole.put_peg(peg);

            let middle_cell = self.layout.panel.get_cell(move['middle_row'], move['middle_column']);
            middle_cell.hole.remove_peg();

            m++;
            if (m < max) {
              play_next_move();
            } else {
              callback();
            }
          }
        }, delay);
      }
      play_next_move();
    }
  }
};class Layout {

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
;class Logger {

    constructor(container) {
        this.container = container;
    }

    write(log, class_name = null) {
        this.count++;
        var li = document.createElement("li");
        
        if(class_name)
            li.classList.add(class_name);

        li.appendChild(document.createTextNode(log));
        this.container.appendChild(li);
    }

    clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}
;let patterns = [
    {
        'name': 'English',
        'diagonal_allowed': false,
        'cells': [
            [null, null, 1, 1, 1, null, null],
            [null, null, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, null, 1, 1, 1, null, null],
            [null, null, 1, 1, 1, null, null]
        ]
    },
    {
        'name': 'European',
        'diagonal_allowed': false,
        'cells': [
            [null, null, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, null, null]
        ]
    },
    {
        'name': 'Wiegleb',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null]
        ]
    },
    {
        'name': 'Diamond (32)',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, 1, null, null, null],
            [null, null, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, null, null],
            [null, null, null, 1, null, null, null],
        ]
    },
    {
        'name': 'Diamond (41)',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, null, 1, null, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, 1, 1, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, null, 1, null, null, null, null],
        ]
    },
    {
        'name': 'Triangle',
        'diagonal_allowed': true,
        'cells': [
            [null, null, null, null, 0],
            [null, null, null, 1, 1],
            [null, null, 1, 1, 1],
            [null, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ]
    }
];class Timer {
    constructor(span) {
        this.span = span;
        this.is_running = false;
        this.start_time = null;
        this.end_time = null;
        this.id = null;
        this.time_elapsed = "0:0";
    }

    start() {
        if (!this.is_running) {
            this.start_time = new Date();
            this.end_time = this.start_time;
            self = this;
            this.span.innerText = this.time_elapsed;
            this.id = window.setInterval(function () {
                self.end_time = new Date();
                let timeDiff = self.end_time - self.start_time;
                timeDiff /= 1000;
                let seconds = Math.round(timeDiff % 60);
                timeDiff = Math.floor(timeDiff / 60);
                let minutes = Math.round(timeDiff % 60);
                self.time_elapsed = minutes + ":" + seconds;
                self.span.innerText = self.time_elapsed;
            }, 1000);
            this.is_running = true;
        }
    };

    stop() {
        if (this.is_running) {
            clearInterval(this.id);
            this.is_running = false;
            this.time_elapsed = "0:0";
        }
    }
}
;let patterns_dropdown = document.getElementById("patterns");
let board_container = document.getElementById("board-container")
let log_container = document.getElementById("log");
let timer_span = document.getElementById("timer");
let start_timer_link = document.getElementById("start_timer");
let undo_link = document.getElementById("undo");
let default_pattern = "English";

// initialize game board
let board = new Board(board_container);
let logger = new Logger(log_container);
let timer = new Timer(timer_span);

// populate patterns dropdown
for (let i = 0; i < patterns.length; i++) {
    let opt = document.createElement('option');
    opt.value = patterns[i]['name'];
    opt.innerHTML = patterns[i]['name'];
    opt.selected = (opt.value === default_pattern) ? true : false;
    patterns_dropdown.appendChild(opt);
}
change_pattern();


// event handlers
function change_pattern() {
    let sure = true;
    if (board.moves.length > 0) {
        sure = confirm("Your progress will be erased. Press OK to continue...");
    }
    if (sure) {
        board.pattern = patterns.find(pattern => {
            return pattern.name === patterns_dropdown.value
        });
        default_pattern = patterns_dropdown.value;
        reset();
    } else {
        patterns_dropdown.value = default_pattern;
        return false;
    }
}

function make_move(row, column) {
    let move_made = board.make_move(row, column);
    if (move_made) {
        let log = prepare_move_log(move_made);
        logger.write(log);
        undo_link.classList.remove('disabled');
    }
    if (board.layout.panel.peg_count === 1) {
        logger.write("You Win!");
    }
}

function prepare_move_log(move) {
    let from_row = move['from_row'] + 1;
    let from_column = move['from_column'] + 1;
    let to_row = move['to_row'] + 1;
    let to_column = move['to_column'] + 1;
    let middle_row = move['middle_row'] + 1;
    let middle_column = move['middle_column'] + 1;

    let log = from_row.toString() + from_column.toString() +
        " to " + to_row.toString() + to_column.toString() + "; " +
        middle_row.toString() + middle_column.toString() + " eliminited.";

    return log;
}

function undo() {
    let undone_move = board.undo();
    if (undone_move) {
        let log = prepare_move_log(undone_move);
        logger.write("undid: " + log);
    }
    if (board.moves.length <= 0)
        undo_link.classList.add('disabled');
}

function reset() {
    board.reset();
    stop_timer();
    timer_span.innerText = "";
    undo_link.classList.add('disabled');
    logger.clear();
}

function replay() {
    stop_timer();
    if (board.moves.length > 0) {
        logger.write("replay started.");
        board.replay(function () {
            logger.write("replay ended.");
        });
    }

}

function start_timer() {
    if (!timer.is_running) {
        timer.start();
        start_timer_link.classList.add('disabled');
        if (timer.start_time)
            logger.write("timer started at " + timer.start_time.toLocaleString());
    }
};

function stop_timer() {
    if (timer.is_running) {
        timer.stop();
        start_timer_link.classList.remove('disabled');
        if (timer.end_time)
            logger.write("timer stopped at " + timer.end_time.toLocaleString());
    }
}
