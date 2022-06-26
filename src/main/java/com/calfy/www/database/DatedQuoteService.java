package com.calfy.www.database;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatedQuoteService {
	
	@Autowired
	DatedQuoteRepository datedQuoteRepository;
	
	public List<DatedQuote> findByName(String name) {
		return datedQuoteRepository.findByName(name);
	}
	
	public List<DatedQuote> findByNameAndYear(String name,String year) {
		return datedQuoteRepository.findByName(name);
	}
	
	public void save(DatedQuote data) {
		datedQuoteRepository.save(data);
	}
}
