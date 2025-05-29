import { WebsocketService } from './services/WebsocketService';
import { EventService } from './services/EventService';
import { DatabaseService } from './services/DatabaseService';
import CONFIG from './config';
import { ApplicationContext } from './constants';
import { TokenMetadataService } from './services/TokenMetadataService';
import { QueueService } from './services/QueueService';
import { CronjobService } from './services/CronjobService';

const operationWs: WebsocketService = new WebsocketService(
  CONFIG.OPERATION_WEBSOCKET_PORT
);
const eventService: EventService = new EventService();
const dbService: DatabaseService = new DatabaseService(
  ApplicationContext.Indexer
);
const metadataService: TokenMetadataService = new TokenMetadataService();
const queue: QueueService = new QueueService();
const cronjobService: CronjobService = new CronjobService();

export { operationWs, eventService, dbService, metadataService, queue, cronjobService };
