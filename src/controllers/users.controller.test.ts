import { Response, Request } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given UsersController', () => {
  const mockRepo: Repo<User> = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }; // Con esto no pide mockear todas las funciones de Repo, aunque aqui no la usemos

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
    status: jest.fn(), // Moquear status tb
  } as unknown as Response;

  const next = jest.fn();

  const controller = new UsersController(mockRepo);

  describe('Given register method from UsersController', () => {
    test('Then it should be called if there are NOT errors', async () => {
      req.body.email = 'email';
      req.body.password = 'test';
      // Instanciar clase controller
      await controller.register(req, resp, next);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no email then an error should be catched and call next()', async () => {
      req.body.email = '';
      req.body.password = 'test';
      // S(mockRepo.create as jest.Mock).mockRejectedValue(HTTPErrorMock);
      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no email then an error should be catched and call next()', async () => {
      req.body.email = 'email';
      req.body.password = '';
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    /* Test.only('Then it should throw an error if email or password not exist', async () => {
      req.body.email = '';
      req.body.password = '';
      /* C await controller.register(req, resp, next);
      expect(HTTPErrorMock).toHaveBeenCalled();
    }); */
  });

  describe('Given the login method from UsersController', () => {
    test('Then json should be called if request is complete', async () => {
      req.body.email = 'email';
      req.body.password = 'test';
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      (Auth.compare as jest.Mock).mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if passwords do not match (Auth.compare(false)) an error should be catch and should call next()', async () => {
      req.body.email = 'email';
      req.body.password = 'test';
      // (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no email an error should be catch and should call next()', async () => {
      req.body.email = '';
      req.body.password = 'test';
      // (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      // (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no pass an error should be catch and should call next()', async () => {
      req.body.email = 'test';
      req.body.password = '';
      // (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      // (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if search return an empty array an error should be catch and should call next()', async () => {
      req.body.email = 'email';
      req.body.password = 'test';
      (mockRepo.search as jest.Mock).mockResolvedValue({
        key: 'email',
        value: 'test-no-equal',
      });
      // (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
