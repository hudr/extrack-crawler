const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const router = express.Router()

router.post('/item', async (req, res) => {
  const { name } = req.body

  switch (name.toLowerCase()) {
    case 'beer':
      try {
        // Sonda
        let beertoList = []
        await axios
          .get('https://www.sondadelivery.com.br/delivery/categoria/Cerveja')
          .then(
            (res) => {
              if (res.status === 200) {
                const html = res.data

                const $ = cheerio.load(html)

                $('.product').each(function (i, elem) {
                  beertoList[i] = {
                    store: 'Sonda',
                    title: $(this).find('.tit').text(),
                    url: `https://www.sondadelivery.com.br${$(this)
                      .find('.js-link-produto')
                      .attr('href')}`,
                    price: $(this).find('.int').text().trim(),
                  }
                })
              }
            },
            (err) => console.log(err)
          )

        // Sempre em casa
        await axios.get('https://sempreemcasa.com.br/collections/cerveja').then(
          (res) => {
            if (res.status === 200) {
              const html = res.data

              const $ = cheerio.load(html)

              $('.product-item.card').each(function (i, elem) {
                beertoList[i] = {
                  store: 'Sempre em casa',
                  title: $(this).find('.product-item__title-text').text(),
                  url: `https://sempreemcasa.com.br${$(this)
                    .find('.product-link')
                    .attr('href')}`,
                  price: $(this)
                    .find('.unity__text')
                    .first()
                    .text()
                    .replace('R$ ', '')
                    .replace(' ', ''),
                }
              })
            }
          },
          (err) => console.log(err)
        )

        const beertoListTrimmed = beertoList.filter((n) => n != undefined)

        // Response
        return res.send(JSON.stringify(beertoListTrimmed, null, 4))
      } catch (err) {
        res.status(400).send({ erro: 'Oops! Encontramos uma falha!' })
      }

      break

    default:
      return res
        .status(404)
        .send({ erro: 'Oops! Não encontramos nada melhor!' })
      break
  }
})

module.exports = (app) => app.use('/find', router)
