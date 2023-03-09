import createDebug from 'debug';
import { Euphonium } from '../../entities/euphonium.js';
import { HTTPError } from '../../errors/custom.error.js';
import { Repo } from '../repo.interface.js';
import { euphoniumModel } from './euphonium.mongo.model.js';
const debug = createDebug('W6:euphonium_repo');

export class EuphoniumsMongoRepo implements Repo<Euphonium> {
  private static instance: EuphoniumsMongoRepo;

  public static getInstance(): EuphoniumsMongoRepo {
    if (!EuphoniumsMongoRepo.instance) {
      EuphoniumsMongoRepo.instance = new EuphoniumsMongoRepo();
    }

    return EuphoniumsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Euphonium[]> {
    debug('query');
    const data = await euphoniumModel
      .find()
      .populate('euphoniums', { euphoniums: 0 })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<Euphonium> {
    debug('queryId');
    const data = await euphoniumModel
      .findById(id)
      .populate('euphoniums', { euphoniums: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await euphoniumModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<Euphonium>): Promise<Euphonium> {
    debug('create');
    const data = await euphoniumModel.create(info);
    return data;
  }

  async update(info: Partial<Euphonium>): Promise<Euphonium> {
    debug('update');
    const data = await euphoniumModel
      .findByIdAndUpdate(info.id, info, {
        new: true,
      })
      .populate('friends', { friends: 0 })
      .populate('enemies', { enemies: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async remove(id: string): Promise<void> {
    debug('destroy');
    const data = await euphoniumModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Remove not possible: id not found'
      );
  }
}
