function init() {
  comic.comicAuthor = "Um Sábado Qualquer"
  comic.websiteUrl = "https://www.umsabadoqualquer.com/"
  comic.identifier = "que-comece-a-concorrencia"
  // comic.shopUrl = "https://www.umalojaqualquer.com/"

  // comic.requestPage(comic.websiteUrl + '?s=', comic.User)
  comic.requestPage(comic.websiteUrl + (comic.lastIdentifier || comic.identifier), comic.Page)
}

function pageRetrieved(id, html) {
  if (id == comic.User) {
    var identifiers = findIdentifiersOfComicPage(html)

    for (id of identifiers) {
      print("*** id: " + id)

      try {
        print("*** comic.websiteUrl" + comic.websiteUrl + id)
        comic.requestPage(comic.websiteUrl + id, comic.Page)
        comic.lastIdentifier = id
        break
      } catch(_) {
        comic.requestPage(comic.websiteUrl + comic.firstIdentifier, comic.Page)
        break
      }
    }
  }

  if (id == comic.Page) {
    getAndSetComicInfo(html)
  }
}

function findIdentifiersOfComicPage(html) {
  var regexOfAllLinkTitles = /a\shref=https:\/\/www\.umsabadoqualquer\.com\/([\w\-]+)\/\sclass=link/gm
  var match = html.match(regexOfAllLinkTitles)

  if (!(match && match.length > 0)) {
    return
  }

  var identifiers = []

  for (link of match) {
    var regexToGetIdentifier = /\.com\/([\w\-]+)\//
    if (match) {
      identifiers.push(regexToGetIdentifier.exec(link)[1])
    }
  }
  return identifiers
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

  comic.title = comic.identifier.replace(/-/g, " ")
  print("Strip title: " + comic.title)

  comic.previousIdentifier = findPrevComicIdentifier(html)
  print("Previous identifier: " + comic.previousIdentifier)

  comic.nextIdentifier = findNextComicIdentifier(html)
  print("Next identifier: " + comic.nextIdentifier)

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
  print("findComicImage")
  var regexOfComicImage =
    /https:\/\/www\.umsabadoqualquer\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/\d+\.png/
  var match = regexOfComicImage.exec(html)

  if (match && match.length) {
    return match[0]
  }
}
