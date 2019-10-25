let patterns_dropdown = document.getElementById("patterns");
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
