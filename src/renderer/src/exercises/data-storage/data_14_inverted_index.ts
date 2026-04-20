import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'data_14_inverted_index',
  title: 'Inverted Index',
  category: 'Data & Storage',
  subcategory: 'Search',
  difficulty: 'advanced',
  order: 14,
  description: `Build an inverted index that maps search terms to document IDs, the core data structure behind search engines.

An inverted index reverses the relationship: instead of "document -> words", it stores "word -> document IDs":

\`\`\`
Documents:
  doc0: "the quick brown fox"
  doc1: "the lazy brown dog"
  doc2: "quick fox jumps"

Index:
  "the"   -> [0, 1]
  "quick" -> [0, 2]
  "brown" -> [0, 1]
  "fox"   -> [0, 2]
  "lazy"  -> [1]
  ...
\`\`\`

Terms should be lowercased. Words are split by whitespace using \`strings.Fields\`.

Implement:
- \`NewIndex()\` - creates an empty inverted index
- \`AddDocument(id int, text string)\` - indexes a document's words
- \`Search(term string) []int\` - returns sorted document IDs containing the term
- \`SearchAnd(terms []string) []int\` - returns doc IDs containing ALL terms (intersection)
- \`SearchOr(terms []string) []int\` - returns doc IDs containing ANY term (union)
- \`DocumentCount() int\` - returns the number of indexed documents`,
  code: `package main

import (
	"sort"
	"strings"
)

// InvertedIndex maps terms to the document IDs that contain them.
type InvertedIndex struct {
	// TODO: Add index map and document count
}

// NewIndex creates an empty inverted index.
func NewIndex() *InvertedIndex {
	// TODO
	return nil
}

// AddDocument indexes all words from the given text under the document ID.
// Words are split by whitespace and lowercased.
func (idx *InvertedIndex) AddDocument(id int, text string) {
	// TODO: Split text into words, lowercase each, add doc ID to term's list
}

// Search returns sorted document IDs that contain the given term (lowercased).
func (idx *InvertedIndex) Search(term string) []int {
	// TODO
	return nil
}

// SearchAnd returns sorted document IDs that contain ALL given terms.
func (idx *InvertedIndex) SearchAnd(terms []string) []int {
	// TODO: Find intersection of results for each term
	return nil
}

// SearchOr returns sorted document IDs that contain ANY of the given terms.
func (idx *InvertedIndex) SearchOr(terms []string) []int {
	// TODO: Find union of results for each term
	return nil
}

// DocumentCount returns the number of documents that have been indexed.
func (idx *InvertedIndex) DocumentCount() int {
	// TODO
	return 0
}

var _ = sort.Ints
var _ = strings.Fields

func main() {}`,
  testCode: `package main

import (
	"sort"
	"testing"
)

func buildTestIndex() *InvertedIndex {
	idx := NewIndex()
	idx.AddDocument(0, "the quick brown fox")
	idx.AddDocument(1, "the lazy brown dog")
	idx.AddDocument(2, "quick fox jumps high")
	return idx
}

func TestIndexSearch(t *testing.T) {
	idx := buildTestIndex()

	results := idx.Search("brown")
	sort.Ints(results)
	if len(results) != 2 || results[0] != 0 || results[1] != 1 {
		t.Errorf("Search(brown) = %v, want [0 1]", results)
	}
}

func TestIndexSearchCaseInsensitive(t *testing.T) {
	idx := buildTestIndex()

	results := idx.Search("QUICK")
	sort.Ints(results)
	if len(results) != 2 || results[0] != 0 || results[1] != 2 {
		t.Errorf("Search(QUICK) = %v, want [0 2]", results)
	}
}

func TestIndexSearchMiss(t *testing.T) {
	idx := buildTestIndex()
	results := idx.Search("cat")
	if len(results) != 0 {
		t.Errorf("Search(cat) = %v, want []", results)
	}
}

func TestIndexSearchAnd(t *testing.T) {
	idx := buildTestIndex()

	results := idx.SearchAnd([]string{"quick", "fox"})
	sort.Ints(results)
	if len(results) != 2 || results[0] != 0 || results[1] != 2 {
		t.Errorf("SearchAnd(quick, fox) = %v, want [0 2]", results)
	}
}

func TestIndexSearchAndNarrow(t *testing.T) {
	idx := buildTestIndex()

	results := idx.SearchAnd([]string{"brown", "lazy"})
	if len(results) != 1 || results[0] != 1 {
		t.Errorf("SearchAnd(brown, lazy) = %v, want [1]", results)
	}
}

func TestIndexSearchAndNoMatch(t *testing.T) {
	idx := buildTestIndex()
	results := idx.SearchAnd([]string{"quick", "lazy"})
	if len(results) != 0 {
		t.Errorf("SearchAnd(quick, lazy) = %v, want []", results)
	}
}

func TestIndexSearchOr(t *testing.T) {
	idx := buildTestIndex()

	results := idx.SearchOr([]string{"lazy", "jumps"})
	sort.Ints(results)
	if len(results) != 2 || results[0] != 1 || results[1] != 2 {
		t.Errorf("SearchOr(lazy, jumps) = %v, want [1 2]", results)
	}
}

func TestIndexSearchOrAll(t *testing.T) {
	idx := buildTestIndex()

	results := idx.SearchOr([]string{"the", "jumps"})
	sort.Ints(results)
	if len(results) != 3 {
		t.Errorf("SearchOr(the, jumps) = %v, want [0 1 2]", results)
	}
}

func TestIndexDocumentCount(t *testing.T) {
	idx := buildTestIndex()
	if idx.DocumentCount() != 3 {
		t.Errorf("DocumentCount() = %d, want 3", idx.DocumentCount())
	}
}

func TestIndexNoDuplicateDocIDs(t *testing.T) {
	idx := NewIndex()
	idx.AddDocument(0, "go go go")

	results := idx.Search("go")
	if len(results) != 1 {
		t.Errorf("Search(go) = %v, should have doc 0 only once", results)
	}
}

func TestIndexEmpty(t *testing.T) {
	idx := NewIndex()
	if idx.DocumentCount() != 0 {
		t.Errorf("DocumentCount() = %d, want 0", idx.DocumentCount())
	}
	results := idx.Search("anything")
	if len(results) != 0 {
		t.Errorf("Search on empty index = %v, want []", results)
	}
}`,
  solution: `package main

import (
	"sort"
	"strings"
)

type InvertedIndex struct {
	index    map[string]map[int]bool
	docCount int
}

func NewIndex() *InvertedIndex {
	return &InvertedIndex{
		index: make(map[string]map[int]bool),
	}
}

func (idx *InvertedIndex) AddDocument(id int, text string) {
	idx.docCount++
	words := strings.Fields(text)
	for _, w := range words {
		w = strings.ToLower(w)
		if idx.index[w] == nil {
			idx.index[w] = make(map[int]bool)
		}
		idx.index[w][id] = true
	}
}

func (idx *InvertedIndex) Search(term string) []int {
	term = strings.ToLower(term)
	docs := idx.index[term]
	result := make([]int, 0, len(docs))
	for id := range docs {
		result = append(result, id)
	}
	sort.Ints(result)
	return result
}

func (idx *InvertedIndex) SearchAnd(terms []string) []int {
	if len(terms) == 0 {
		return nil
	}
	// Start with results for the first term
	result := idx.Search(terms[0])
	for _, term := range terms[1:] {
		other := idx.Search(term)
		otherSet := make(map[int]bool, len(other))
		for _, id := range other {
			otherSet[id] = true
		}
		var intersected []int
		for _, id := range result {
			if otherSet[id] {
				intersected = append(intersected, id)
			}
		}
		result = intersected
	}
	sort.Ints(result)
	return result
}

func (idx *InvertedIndex) SearchOr(terms []string) []int {
	seen := make(map[int]bool)
	for _, term := range terms {
		for _, id := range idx.Search(term) {
			seen[id] = true
		}
	}
	result := make([]int, 0, len(seen))
	for id := range seen {
		result = append(result, id)
	}
	sort.Ints(result)
	return result
}

func (idx *InvertedIndex) DocumentCount() int {
	return idx.docCount
}

func main() {}`,
  hints: [
    'Use map[string]map[int]bool for the index: term -> set of doc IDs. Using a set prevents duplicate doc IDs.',
    'SearchAnd: start with the first term results, then intersect with each subsequent term results.',
    'SearchOr: collect all doc IDs from all terms into a set, then convert to a sorted slice.',
  ],
}

export default exercise
