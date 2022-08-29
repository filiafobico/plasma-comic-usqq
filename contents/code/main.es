function init() {
  comic.comicAuthor = "Carlos Ruas"
  comic.websiteUrl = "https://www.umsabadoqualquer.com/"

  if (comic.identifier) {
    comic.requestPage(comic.websiteUrl + comic.identifier, comic.Page)
  } else {
    comic.requestPage(comic.websiteUrl + "?s=", comic.User)
  }
}

function pageRetrieved(id, html) {
  if (id == comic.User) {
    comic.lastIdentifier = findLastComicIdentifier(html)
    comic.requestPage(comic.websiteUrl + comic.lastIdentifier, comic.Page)
  }

  if (id == comic.Page) {
    getAndSetComicInfo(html)
  }
}

function findLastComicIdentifier(html) {
  var regexOfAllLinkTitles = /(<\/script>\s<\/div>).+?(a\shref=https:\/\/www\.umsabadoqualquer\.com\/([\w\-]+)\/\sclass=link)/
  var match = html.match(regexOfAllLinkTitles)

  if (match && match.length > 2) {
    return match[3]
  }
}

function getAndSetComicInfo(html) {
  var shopUrl = findComicImage(html)
  if (!shopUrl) return false

  var previousIdentifier = findPrevComicIdentifier(html)
  if (!previousIdentifier) return false

  var nextIdentifier = findNextComicIdentifier(html)
  if (!nextIdentifier) return false

  comic.shopUrl = shopUrl
  comic.requestPage(comic.shopUrl, comic.Image)

  comic.title = comic.identifier.replace(/[^\w\d]/g, ' ').replace(/\b(\w)/g, (letter) => letter.toUpperCase())
  comic.previousIdentifier = previousIdentifier
  comic.nextIdentifier = nextIdentifier
}

function findNextComicIdentifier(html) {
  var regexOfNextComic =
    /href=https:\/\/www\.umsabadoqualquer\.com\/([\w\-]+)\/\srel=next/
  var match = regexOfNextComic.exec(html)

  if (match && match.length > 0) {
    return match[1]
  }
}

function findPrevComicIdentifier(html) {
  var regexOfPrevComic =
    /href=https:\/\/www\.umsabadoqualquer\.com\/([\w\-]+)\/\srel=prev/
  var match = regexOfPrevComic.exec(html)

  if (match && match.length > 0) {
    return match[1]
  }
}

function findComicImage(html) {
  var regexOfComicImage =
    /https:\/\/www\.umsabadoqualquer\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/\d+\.png/
  var match = regexOfComicImage.exec(html)

  if (match && match.length) {
    return match[0]
  }
}
