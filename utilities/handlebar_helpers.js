const { options } = require("../routes/admin/posts");
const moment = require("moment");

const Helpers = {
  /* method to replace all <option></option> data on the template/FE */
  select: function (selectedStatus, options) {
    return options
      .fn(this)
      .replace(
        new RegExp('value="' + selectedStatus + '"'),
        "$&selected='selected'"
      );
  },

  generateTime: function (date, format) {
    return moment(date).format(format);
  },

  paginate: function (options) {
    // console.log(options.hash.current);

    let output = "";

    if (options.hash.current === 1) {
      output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
    } else {
      output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
    }

    /* to show '...' after some pages (5 chosen here) */
    let i =
      Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1;

    /* show "..." after <a>First</a> (shown 4 link tags before current link page) */
    if (i !== 1) {
      output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
    }
    /* /show "..." after <a>First</a> */

    for (
      ;
      i <= Number(options.hash.current) + 4 && i <= options.hash.pages;
      i++
    ) {
      if (i === options.hash.current) {
        // make the previous page active and disable the current page
        output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
      } else {
        output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
      }

      /* show "..." before <a>Last</a> link (shown 4 link tags after current page) */
      if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
        output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
      /* /show "..." before <a>Last</a> link */
    }

    /* to get the last page link */
    if (options.hash.current === options.hash.pages) {
      // if at the last page
      output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
    } else {
      // if not at the last page, make it active
      output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
    }

    return output;
  },

  frontpagePostSlicer: function (options) {
    return options.slice(0, 200) + "...";
  },
};

module.exports = Helpers;
