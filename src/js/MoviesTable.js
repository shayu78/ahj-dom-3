export default class MoviesTable {
  constructor(columns) {
    this.columns = columns;
    this.theadElement = null;
    this.tableElement = null;
    this.jsonDataArray = [];
  }

  create(jsonData) {
    this.tableElement = document.createElement('table');
    this.theadElement = this.tableElement.createTHead();
    this.columns.forEach((value) => {
      const tdElement = document.createElement('td');
      const textElement = document.createTextNode(value);
      tdElement.append(textElement);
      this.theadElement.append(tdElement);
    });

    this.columnKeys = Object.keys([...jsonData][0]);
    this.jsonDataArray = [...jsonData];
    this.generateBody();

    const bodyElement = document.querySelector('body');
    bodyElement.insertAdjacentElement('afterbegin', this.tableElement);
  }

  generateBody() {
    if (this.tableElement.tBodies[0]) this.tableElement.tBodies[0].remove();
    const fragment = new DocumentFragment();
    this.jsonDataArray.forEach((value) => {
      const trElement = this.tableElement.insertRow(-1);

      const tdIdElement = document.createElement('td');
      const tdTitleElement = document.createElement('td');
      const tdYearElement = document.createElement('td');
      const tdImdbElement = document.createElement('td');

      for (const key in this.columnKeys) {
        if (Object.prototype.hasOwnProperty.call(this.columnKeys, key)) {
          const element = this.columnKeys[key];
          switch (element) {
            case 'id': {
              const textElement = document.createTextNode(value[element]);
              tdIdElement.append(textElement);
              break;
            }
            case 'title': {
              const textElement = document.createTextNode(value[element]);
              tdTitleElement.append(textElement);
              break;
            }
            case 'year': {
              const textElement = document.createTextNode(value[element]);
              tdYearElement.append(textElement);
              break;
            }
            case 'imdb': {
              const textElement = document.createTextNode(value[element].toFixed(2));
              tdImdbElement.append(textElement);
              break;
            }
            default:
              break;
          }
        }
      }
      trElement.append(tdIdElement, tdTitleElement, tdYearElement, tdImdbElement);
      fragment.append(trElement);
    });
    this.tableElement.tBodies[0].append(fragment);
  }

  sort(sortField, reverse = false) {
    document.querySelectorAll('.asc-arrow, .desc-arrow')
      .forEach((value) => value.classList.remove('asc-arrow', 'desc-arrow'));
    switch (sortField) {
      case 'id': {
        this.jsonDataArray.sort((a, b) => {
          const aInt = parseInt(a.id, 10);
          const bInt = parseInt(b.id, 10);
          if (aInt < bInt) return -1;
          if (aInt > bInt) return 1;
          return 0;
        });
        break;
      }
      case 'year': {
        this.jsonDataArray.sort((a, b) => {
          const aInt = parseInt(a.year, 10);
          const bInt = parseInt(b.year, 10);
          if (aInt < bInt) return -1;
          if (aInt > bInt) return 1;
          return 0;
        });
        break;
      }
      case 'imdb': {
        this.jsonDataArray.sort((a, b) => {
          const aFloat = parseFloat(a.imdb, 10);
          const bFloat = parseFloat(b.imdb, 10);
          if (aFloat < bFloat) return -1;
          if (aFloat > bFloat) return 1;
          return 0;
        });
        break;
      }
      case 'title': {
        this.jsonDataArray.sort((a, b) => {
          const aString = a.title.toLowerCase().replace('ё', `е${String.fromCharCode(1500)}`);
          const bString = b.title.toLowerCase().replace('ё', `е${String.fromCharCode(1500)}`);
          if (aString < bString) return -1;
          if (aString > bString) return 1;
          return 0;
        });
        break;
      }
      default:
        return;
    }
    const tHeadChildren = this.theadElement.children;
    if (reverse) {
      this.jsonDataArray.reverse();
      tHeadChildren[this.columns.indexOf(sortField)].classList.add('desc-arrow');
    } else tHeadChildren[this.columns.indexOf(sortField)].classList.add('asc-arrow');
  }
}
