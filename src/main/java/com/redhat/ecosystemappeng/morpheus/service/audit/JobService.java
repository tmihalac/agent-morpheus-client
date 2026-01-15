package com.redhat.ecosystemappeng.morpheus.service.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redhat.ecosystemappeng.morpheus.model.audit.Job;
import com.redhat.ecosystemappeng.morpheus.repository.JobRepositoryService;
import com.redhat.ecosystemappeng.morpheus.service.UserService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@ApplicationScoped
public class JobService extends AuditService {

    private static final Logger LOGGER = Logger.getLogger(JobService.class);


   @Inject
  JobRepositoryService repository;

  @Inject
  ObjectMapper mapper;

  @Inject
  ObjectMapper objectMapper;

  public void save(Job job) throws JsonProcessingException {
    LOGGER.debugf("Saving Job %s", job.getJobId());
    String jobJSON = mapper.writeValueAsString(job);
    repository.save(jobJSON);
  }
  
  public Job getById(String id) throws JsonProcessingException {
    LOGGER.debugf("Getting job %s by internal id", id);
    String jobJSON = repository.findById(id);
    return deserializeOneJob(jobJSON);

  }

  public Job getByJobId(String jobId) throws JsonProcessingException {
    LOGGER.debugf("Getting job %s by job Id", jobId);
    String jobJSON = repository.findByJobId(jobId);
    return deserializeOneJob(jobJSON);
  }


  public List<Job> getAllJobs() throws JsonProcessingException {
    LOGGER.debugf("Getting all jobs");
      List<String> allJobs = repository.findAll();
      return transformJobsJsonsToPojos(allJobs);
  }


  public List<Job> getAllJobByBatchId(String batchId) throws JsonProcessingException {
      LOGGER.debugf("Getting all jobs documents of batchId %s", batchId);
      List<String> allJobs = repository.findAllJobsByBatchId(batchId);
      return transformJobsJsonsToPojos(allJobs);
  }

  public List<Job> getAllJobByCve(String cveId) throws JsonProcessingException {
      LOGGER.debugf("Getting all jobs documents of vulnerability %s", cveId);
      List<String> allJobs = repository.findAllJobsByCve(cveId);
      return transformJobsJsonsToPojos(allJobs);
  }

public List<Job> getAllJobByCveAndApplication(String cveId, String appName, String appVersion) throws JsonProcessingException {
      LOGGER.debugf("Getting all jobs documents of vulnerability %s", cveId);
      List<String> allJobs = repository.findAllJobsByCveAndComponent(cveId, appName, appVersion);
      return transformJobsJsonsToPojos(allJobs);
  }


  public void remove(String id) {
    LOGGER.debugf("Removing Job internal id %s", id);
    repository.removeById(id);

  }

  public void removeByJobId(String jobId) {
    LOGGER.debugf("Removing Job jobId %s", jobId);
    repository.removeByJobId(jobId);
  }

  public void removeMany(List<String> ids) {
    LOGGER.debugf("Removing internal Jobs ids %s", ids.toString());
    repository.removeMany(ids);
  }

  public void removeManyJobsIds(List<String> ids) {
    LOGGER.debugf("Removing Jobs ids %s", ids.toString());
    repository.removeManyJobsIds(ids);
  }

  private List<Job> transformJobsJsonsToPojos(List<String> allJobs) throws JsonProcessingException {
        if (allJobs.size() >= THRESHOLD_NUMBER_OF_DB_ITEMS_FOR_PARALLEL_PROCESSING) {
            return allJobs.parallelStream().map(deserializeJob()).collect(Collectors.toList());
        }
        else {
            return allJobs.stream().map(deserializeJob()).collect(Collectors.toList());
        }

    }


  private Function<String, Job> deserializeJob() throws JsonProcessingException {
        return json -> {
            try {
                return deserializeOneJob(json);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        };
    }
  private Job deserializeOneJob(String jobJSON) throws JsonProcessingException {
      return this.objectMapper.readValue(jobJSON, Job.class);
    }

}
