import { MapperUtils } from './mapper.utils';
import { CardDTO } from '../dto/card.dto';

export class PagarmeMapper {
  static toCardDTO(card: any): CardDTO {
    const cardObject = MapperUtils.toCamelObject(card);
    delete cardObject['customer'];

    const cardDTO = new CardDTO();
    const fields = Object.getOwnPropertyNames(cardObject);
    fields.forEach(field => { cardDTO[field] = cardObject[field]; });
    return cardDTO;
  }

  static toCardsDTO(cards: any[]): CardDTO[] {
    return cards.map(card => PagarmeMapper.toCardDTO(card));
  }
}

