package com.calfy.www.database;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatedQuoteRepository extends MongoRepository<DatedQuote, String>{

    public List<DatedQuote> findByName(String name);
    public List<DatedQuote> findByNameAndYear(String name,String year);
}
