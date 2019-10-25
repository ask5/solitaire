class Logger {

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
