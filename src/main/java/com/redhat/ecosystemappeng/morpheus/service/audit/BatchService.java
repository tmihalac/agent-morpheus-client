package com.redhat.ecosystemappeng.morpheus.service.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redhat.ecosystemappeng.morpheus.model.audit.Batch;
import com.redhat.ecosystemappeng.morpheus.repository.BatchRepositoryService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@ApplicationScoped
public class BatchService extends AuditService {

    private static final Logger LOGGER = Logger.getLogger(BatchService.class);


  @Inject
  BatchRepositoryService repository;

  @Inject
  ObjectMapper mapper;

  @Inject
  ObjectMapper objectMapper;

  public void save(Batch batch) throws JsonProcessingException {
    LOGGER.debugf("Saving batch %s", batch.getBatchId());
    String batchJSON = mapper.writeValueAsString(batch);
    repository.save(batchJSON);
  }
  
  public Batch getById(String id) throws JsonProcessingException {
    LOGGER.debugf("Getting batch %s by internal id", id);
    String batchJson = repository.findById(id);
    return deserializeOneBatch(batchJson);

  }

  public Batch getByJobId(String batchId) throws JsonProcessingException {
    LOGGER.debugf("Getting Batch %s by batch Id", batchId);
    String batchJSON = repository.findByBatchId(batchId);
    return deserializeOneBatch(batchJSON);
  }


  public List<Batch> getAllBatches() throws JsonProcessingException {
    LOGGER.debugf("Getting all batches");
      List<String> allBatches = repository.findAll();
      return transformBatchesJsonsToPojos(allBatches, false);
  }

  public List<Batch> getMixedLanguagesBatches() throws JsonProcessingException {
    LOGGER.debugf("Getting all Mixed Languages batches");
      List<String> allBatches = repository.findAllMixedLanguagesBatches();
      return transformBatchesJsonsToPojos(allBatches, false);
  }

  public List<Batch> getAllBatchesByLanguage(String language) throws JsonProcessingException {
    LOGGER.debugf("Getting all batches of language %s", language);
      List<String> allBatches = repository.findAllBatchesByLanguage(language);
      return transformBatchesJsonsToPojos(allBatches, false);
  }

  public Batch getLatestBatch(boolean languageSpecific, String language) throws JsonProcessingException {
    LOGGER.debugf("Getting latest %s batch", languageSpecific ? language : "Mixed Languages");
      String latestExecutedBatch = repository.findLatestExecutedBatch(languageSpecific, language);
      return deserializeOneBatch(latestExecutedBatch);
  }


  public void remove(String id) {
    LOGGER.debugf("Removing Batch internal id %s", id);
    repository.removeById(id);

  }

  public void removeByBatchId(String batchId) {
    LOGGER.debugf("Removing batch batchId %s", batchId);
    repository.removeByBatchId(batchId);
  }

  public void removeMany(List<String> ids) {
    LOGGER.debugf("Removing internal Batches ids %s", ids.toString());
    repository.removeMany(ids);
  }

  public void removeManyBatchIds(List<String> ids) {
    LOGGER.debugf("Removing Jobs ids %s", ids.toString());
    repository.removeManyBatchIds(ids);
  }

  private List<Batch> transformBatchesJsonsToPojos(List<String> allJobs, boolean allowParallelProcessing) throws JsonProcessingException {
        if (allowParallelProcessing && allJobs.size() >= THRESHOLD_NUMBER_OF_DB_ITEMS_FOR_PARALLEL_PROCESSING) {
            return allJobs.parallelStream().map(deserializeJob()).collect(Collectors.toList());
        }
        else {
            return allJobs.stream().map(deserializeJob()).collect(Collectors.toList());
        }

    }


  private Function<String, Batch> deserializeJob() throws JsonProcessingException {
        return json -> {
            try {
                return deserializeOneBatch(json);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        };
    }
  private Batch deserializeOneBatch(String batchJson) throws JsonProcessingException {
      return this.objectMapper.readValue(batchJson, Batch.class);
    }

}
