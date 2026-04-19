# Project Expansion & Simplification Analysis

## Overview
Analysis of existing projects (cli, lex, queue, rest, sub) and opportunities for meaningful expansion or simplification.

---

## 1. EXISTING PROJECTS ANALYSIS

### proj-CLI (6 steps, ~103 lines avg)
**Status**: Well-balanced progression ✓
- Step 1-3: Basic functionality (60-70 lines) - Good
- Step 4-5: Growing complexity (99-134 lines) - Manageable
- Step 6: Capstone (182 lines) - Appropriate for final step

**Recommendations**:
- ✓ KEEP AS-IS - Good granularity and progression
- Could ADD step 7-8 for advanced features:
  - Step 7: Envvar defaults (`--key=value` with fallback to ENV)
  - Step 8: Config file loading (YAML/JSON config + CLI override)

### proj-LEX (6 steps, ~108 lines avg)
**Status**: Well-structured ✓
- All steps are balanced (80-133 lines)
- Good progression from simple to complex

**Recommendations**:
- ✓ KEEP AS-IS - Good scope
- Could ADD step 7-8 for real-world lexer features:
  - Step 7: Comments (`// single-line` and `/* multi-line */`)
  - Step 8: Error recovery (report lexing errors with position info)

### proj-QUEUE (6 steps, ~103 lines avg)
**Status**: Well-balanced ✓
- Progressive complexity (72-143 lines)
- Good use of concurrency concepts

**Recommendations**:
- ✓ KEEP AS-IS - Good scope
- Could ADD step 7-8 for production features:
  - Step 7: Priority queues (tasks with priority levels)
  - Step 8: Metrics & monitoring (task success rates, latency histograms)

### proj-REST (6 steps, ~145 lines avg)
**Status**: Slightly large but appropriate ✓
- Step 1: Foundation (108 lines)
- Steps 2-6: Growing complexity (119-196 lines)
- Last step is complex (196 lines) - but it's a capstone

**Recommendations**:
- ⚠️ Consider breaking step 6 into 2 steps:
  - Step 6: Graceful shutdown with signal handling
  - Step 7: Rate limiting middleware
- ✓ Could ADD step 8:
  - Step 8: Pagination (limit/offset query params)

### proj-SUB (5 steps, ~118 lines avg)
**Status**: Range is too wide (60-194 lines) ⚠️
- Step 1-3: Small (60-97 lines) - Good
- Step 4-5: Large (160-194 lines) - COMPLEX

**Recommendations**:
- 🔧 RECOMMEND SPLITTING steps 4-5:
  - Step 4: Per-command flags (160 lines current)
  - Step 5: Global flags (NEW - ~80 lines)
  - Step 6: Subcommand help formatting (~100 lines)
  - Step 7: Full todo CLI with persistence (capstone)

---

## 2. MISSING PROJECTS (in dependencies.ts but not created)

These are defined in dependencies.ts but have NO exercise files yet.

### proj-KV (3 steps planned)
**Status**: NOT CREATED - Create it!
- `proj-kv-01`: Key-Value Store — Basic Get/Set
- `proj-kv-02`: Key-Value Store — Protocol Parser
- `proj-kv-03`: Key-Value Store — TCP Server

**Recommendation**: ✅ **CREATE THIS** - Medium complexity, useful project
- Could expand to 5-6 steps with:
  - Step 1: In-memory map with basic ops
  - Step 2: Thread-safe with RWMutex
  - Step 3: Text protocol (SET key value, GET key)
  - Step 4: TCP server
  - Step 5: Persistence (AOF log)
  - Step 6: Expiration (TTL) - Capstone

### proj-WATCHER (3 steps planned)
**Status**: NOT CREATED - Create it!
- `proj-watcher-01`: File Watcher — Poll Files
- `proj-watcher-02`: File Watcher — Events Channel
- `proj-watcher-03`: File Watcher — Multiple Listeners

**Recommendation**: ✅ **CREATE THIS** - Good for learning concurrency
- Could expand to 5 steps:
  - Step 1: File polling (os.Stat, track mtime)
  - Step 2: Event emission (channels)
  - Step 3: Multiple listeners (broadcast pattern)
  - Step 4: Filtering (watch only certain patterns)
  - Step 5: Debouncing (batch rapid changes) - Capstone

### proj-LOG (3 steps planned)
**Status**: NOT CREATED - Create it!
- `proj-log-01`: Logger — Entry & Level
- `proj-log-02`: Logger — Thread-Safe Store
- `proj-log-03`: Logger — File Sink

**Recommendation**: ✅ **CREATE THIS** - Practical and incremental
- Could expand to 5-6 steps:
  - Step 1: Log entry struct, levels (DEBUG/INFO/WARN/ERROR)
  - Step 2: Thread-safe in-memory log storage
  - Step 3: Filtering by level
  - Step 4: File sink (write to disk)
  - Step 5: Log rotation (max size)
  - Step 6: Structured logging (JSON format) - Capstone

### proj-GIT (3 steps planned)
**Status**: NOT CREATED - Create it!
- `proj-git-01`: Git — Hash Objects
- `proj-git-02`: Git — Refs
- `proj-git-03`: Git — Object Store on Disk

**Recommendation**: ✅ **CREATE THIS** - Advanced, but very educational
- Could expand to 6-7 steps:
  - Step 1: Content hashing (SHA1 hash any input)
  - Step 2: Object structure (blob, tree, commit basics)
  - Step 3: File storage (.git/objects directory)
  - Step 4: Refs (branch pointers)
  - Step 5: Building a commit (tree + message + parent)
  - Step 6: Basic log (traverse commits)
  - Step 7: Diff (compare two commits) - Capstone

### proj-CONTAINER (3 steps planned)
**Status**: NOT CREATED - Create it!
- `proj-container-01`: Container — Namespace
- `proj-container-02`: Container — Cgroup Limits
- `proj-container-03`: Container — Process Isolation

**Recommendation**: ⚠️ **OPTIONAL/ADVANCED** - Very complex topic
- This is more of a simulation than real containers
- Could create simplified version:
  - Step 1: Process struct (simulate container)
  - Step 2: Resource limits (tracking CPU/memory)
  - Step 3: Process isolation (separate namespaces simulation)
  - Might be too advanced unless following specific learning goal

---

## 3. SUMMARY & PRIORITY RECOMMENDATIONS

### HIGH PRIORITY - Create These (2-3 hours each)
1. **proj-KV** (Key-Value Store)
   - Practical, builds on basics
   - Use: RWMutex, maps, TCP, concurrency
   - Expand to 6 steps

2. **proj-LOG** (Structured Logger)
   - Practical, builds on structs/concurrency
   - Use: Concurrency, file I/O, interfaces
   - Expand to 6 steps

3. **proj-WATCHER** (File System Watcher)
   - Good for learning concurrency patterns
   - Use: Channels, goroutines, file operations
   - Expand to 5 steps

### MEDIUM PRIORITY - Create These
4. **proj-GIT** (Git-like Version Control)
   - Educational and cool
   - Use: Hashing, data structures, file storage
   - Expand to 7 steps

### LOW PRIORITY - Skip or Simplify
5. **proj-CONTAINER** (Container Simulation)
   - Very advanced, more research than practice
   - Consider skipping or creating simplified version

### RECOMMENDED REFACTORING - Existing Projects
1. **proj-SUB** - SPLIT into 7 steps (currently 60-194 line range is too wide)
2. **proj-REST** - SPLIT step 6 into 2 steps (197 lines is large)
3. **proj-CLI** - Optional: ADD steps 7-8 for config/envvar features
4. **proj-LEX** - Optional: ADD steps 7-8 for comments/error handling
5. **proj-QUEUE** - Optional: ADD steps 7-8 for priorities/metrics

---

## 4. IMPLEMENTATION ROADMAP

### Phase 1 (This Session) - High Priority
- [ ] Create proj-kv (6 steps)
- [ ] Create proj-log (6 steps)
- [ ] Create proj-watcher (5 steps)
- Total: 17 new exercises

### Phase 2 (Optional) - Medium Priority
- [ ] Refactor proj-sub (split into 7 steps, +2 new)
- [ ] Refactor proj-rest (split step 6, +1 new)
- [ ] Create proj-git (7 steps)
- Total: 10 new exercises

### Phase 3 (Optional) - Enhancement
- [ ] Add optional steps to cli/lex/queue
- [ ] Create simplified proj-container (if desired)

---

## ESTIMATED EFFORT

| Project | Steps | Effort | Status |
|---------|-------|--------|--------|
| proj-kv | 6 | 2-3 hrs | CREATE |
| proj-log | 6 | 2-3 hrs | CREATE |
| proj-watcher | 5 | 2 hrs | CREATE |
| proj-git | 7 | 3-4 hrs | CREATE |
| proj-sub refactor | 7 | 2 hrs | REFACTOR |
| proj-rest refactor | 7 | 1 hr | REFACTOR |

**Total for High Priority**: ~6-7 hours
**Total with Medium**: ~13-16 hours

---

## WHICH SHOULD WE START WITH?

**Recommendation**: Start with **proj-KV** and **proj-LOG**
- Both are practical and useful
- Build on fundamentals (maps, concurrency, file I/O)
- Good difficulty progression
- Can be done in parallel (independent)

Would you like me to create these projects?
