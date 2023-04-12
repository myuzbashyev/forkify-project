import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //Page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      // return 'page 1 and others';
      return this._generateMarkupButton('+');
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      //   return 'last page';
      return this._generateMarkupButton('-');
    }
    //Other page
    if (curPage < numPages) {
      //   return 'other page';
      return [this._generateMarkupButton('+'), this._generateMarkupButton('-')];
    }
    //Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButton(el) {
    const curPage = this._data.page;
    if (el === '+')
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    if (el === '-')
      return `
      <button data-goto="${
        curPage - 1
      }"class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>
      `;
  }
}

export default new PaginationView();
