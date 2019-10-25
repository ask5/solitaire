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
}