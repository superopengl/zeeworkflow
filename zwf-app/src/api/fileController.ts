
import { getRepository, getManager, Brackets } from 'typeorm';
import { File } from '../entity/File';
import { assert } from '../utils/assert';
import { handlerWrapper } from '../utils/asyncHandler';
import { assertRole } from "../utils/assertRole";
import { getNow } from '../utils/getNow';
import { Task } from '../entity/Task';
import { uploadToS3 } from '../utils/uploadToS3';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../types/Role';
import { getUserIdFromReq } from '../utils/getUserIdFromReq';
import { getOrgIdFromReq } from '../utils/getOrgIdFromReq';
import { existsQuery } from '../utils/existsQuery';
import { getRoleFromReq } from '../utils/getRoleFromReq';
import { streamFileToResponse } from '../utils/streamFileToResponse';
import { TaskDoc } from '../entity/TaskDoc';

export const downloadTaskFile = handlerWrapper(async (req, res) => {
  assertRole(req, 'system', 'admin', 'client', 'agent');
  const { taskId, fileId } = req.params;
  const { user: { id: userId, role } } = req as any;

  const taskRepo = getRepository(TaskDoc);
  const taskDoc = await taskRepo.findOne({taskId, fileId}, {relations: ['file']});
  assert(taskDoc?.file, 404);

  if (role === 'client') {
    const now = getNow();
    taskDoc.lastClientReadAt = now;
    await taskRepo.save(taskDoc);
  }

  streamFileToResponse(taskDoc.file, res);
});

export const getPrivateFileStream = handlerWrapper(async (req, res) => {
  assertRole(req, 'system', 'admin', 'client', 'agent');
  const { id } = req.params;
  const user = (req as any).user;
  const userId = user.id;
  const role = user.role;

  const m = getManager();
  let queryBuilder = m
    .getRepository(File)
    .createQueryBuilder('f')
    .where(`id = :id`, { id })
  switch (role) {
    case Role.Admin:
    case Role.Agent:
      queryBuilder = queryBuilder.andWhere(
        new Brackets(qb => qb
          .where(`owner = :userId`, { userId })
        )
      );
      break;
    case Role.Client:
      queryBuilder = queryBuilder.andWhere(`owner = :userId`, { userId });
    case Role.System:
      break;
    default:
      assert(false, 500, 'Impossible code path')
  }
  const file = await queryBuilder.getOne();

  streamFileToResponse(file, res);
});

export const getPublicFileStream = handlerWrapper(async (req, res) => {
  const { id } = req.params;
  const file = await getRepository(File).findOne({ id, public: true });

  streamFileToResponse(file, res);
});

export const getFileMeta = handlerWrapper(async (req, res) => {
  const { id } = req.params;
  const repo = getRepository(File);
  const file = await repo.findOne(id);
  assert(file, 404);
  res.json(file);
});

export const searchFileMetaList = handlerWrapper(async (req, res) => {
  const { ids } = req.body;
  const files = await getRepository(File)
    .createQueryBuilder()
    .where('id IN (:...ids)', { ids })
    .getMany();
  res.json(files);
});


export const uploadFile = handlerWrapper(async (req, res) => {
  assertRole(req, 'system', 'admin', 'client', 'agent');
  const { file } = (req as any).files;
  assert(file, 400, 'No file to upload');
  const { name, data, mimetype, md5 } = file;
  const userId = getUserIdFromReq(req);

  const id = uuidv4();
  const location = await uploadToS3(id, name, data);

  const entity: File = {
    id,
    createdBy: userId,
    fileName: name,
    mime: mimetype,
    location,
    md5,
    public: !!req.query.public
  };

  const repo = getRepository(File);
  await repo.insert(entity);

  res.json(entity);
});