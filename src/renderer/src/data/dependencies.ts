// Exercise prerequisite / dependency graph for Go Dojo
// Maps exercise ID → array of exercise IDs that must be completed first
// IDs verified against actual exercise files (01-basics.ts … 10-projects.ts)

export const REQUIRES: Record<string, string[]> = {
  // ── Basics ──────────────────────────────────────────────────────────────
  'basics_01_hello':                [],
  'basics_02_variables':            ['basics_01_hello'],
  'basics_03_short_declaration':    ['basics_02_variables'],
  'basics_04_zero_values':          ['basics_03_short_declaration'],
  'basics_05_constants':            ['basics_02_variables'],
  'basics_06_iota':                 ['basics_05_constants'],
  'basics_07_basic_types':          ['basics_02_variables'],
  'basics_08_type_conversion':      ['basics_07_basic_types'],
  'basics_09_functions':            ['basics_02_variables'],
  'basics_10_multiple_returns':     ['basics_09_functions'],
  'basics_11_named_returns':        ['basics_10_multiple_returns'],
  'basics_12_variadic':             ['basics_09_functions'],
  'basics_13_if_else':              ['basics_02_variables'],
  'basics_14_switch':               ['basics_13_if_else'],
  'basics_15_switch_no_condition':  ['basics_14_switch'],
  'basics_16_for_loop':             ['basics_13_if_else'],
  'basics_17_for_range':            ['basics_16_for_loop'],
  'basics_18_while_loop':           ['basics_16_for_loop'],
  'basics_19_strings':              ['basics_07_basic_types'],
  'basics_20_runes':                ['basics_19_strings'],
  'basics_21_string_builder':       ['basics_19_strings'],
  'basics_22_arrays':               ['basics_16_for_loop'],
  'basics_23_slices':               ['basics_22_arrays'],
  'basics_24_maps':                 ['basics_23_slices'],
  'basics_25_map_operations':       ['basics_24_maps', 'stdlib_04_sort'],
  'basics_26_slice_operations':     ['basics_23_slices', 'basics_24_maps'],
  'basics_27_structs':              ['basics_09_functions'],
  'basics_28_struct_methods':       ['basics_27_structs'],
  'basics_29_pointers':             ['basics_28_struct_methods'],
  'basics_30_pointers_and_structs': ['basics_29_pointers'],

  // ── Type System ──────────────────────────────────────────────────────────
  'types_01_interfaces':             ['basics_28_struct_methods'],
  'types_02_implicit_implementation':['types_01_interfaces'],
  'types_03_interface_composition':  ['types_02_implicit_implementation'],
  'types_04_type_assertions':        ['types_01_interfaces'],
  'types_05_type_switch':            ['types_04_type_assertions'],
  'types_06_empty_interface':        ['types_05_type_switch'],
  'types_07_custom_types':           ['basics_07_basic_types'],
  'types_08_type_aliases':           ['types_07_custom_types'],
  'types_09_stringer_interface':     ['types_01_interfaces'],
  'types_10_error_interface':        ['types_01_interfaces'],
  'types_11_generic_functions':      ['basics_09_functions', 'types_01_interfaces'],
  'types_12_generic_types':          ['types_11_generic_functions'],
  'types_13_generic_constraints':    ['types_12_generic_types'],
  'types_14_type_sets':              ['types_13_generic_constraints'],
  'types_15_struct_embedding':       ['basics_27_structs'],
  'types_16_interface_embedding':    ['types_03_interface_composition'],
  'types_17_comparable_constraint':  ['types_11_generic_functions'],
  'types_18_method_sets':            ['types_01_interfaces', 'basics_28_struct_methods'],
  'types_19_type_parameters':        ['types_13_generic_constraints'],
  'types_20_constraints_package':    ['types_14_type_sets'],

  // ── Error Handling ───────────────────────────────────────────────────────
  'errors_01_basics':       ['basics_10_multiple_returns', 'stdlib_03_strconv'],
  'errors_02_custom':       ['errors_01_basics', 'types_01_interfaces'],
  'errors_03_wrapping':     ['errors_02_custom', 'stdlib_03_strconv'],
  'errors_04_is':           ['errors_03_wrapping'],
  'errors_05_as':           ['errors_03_wrapping'],
  'errors_06_sentinel':     ['errors_01_basics'],
  'errors_07_panic':        ['errors_01_basics'],
  'errors_08_recover':      ['errors_07_panic'],
  'errors_09_defer_basics': ['basics_09_functions'],
  'errors_10_defer_closures':['errors_09_defer_basics'],
  'errors_11_defer_cleanup': ['errors_09_defer_basics', 'errors_01_basics'],
  'errors_12_strategies':   ['errors_04_is', 'errors_05_as'],
  'errors_13_must':         ['errors_07_panic', 'errors_08_recover', 'stdlib_03_strconv'],
  'errors_14_multi_error':  ['errors_03_wrapping'],
  'errors_15_hierarchy':    ['errors_02_custom', 'types_04_type_assertions'],

  // ── Concurrency ──────────────────────────────────────────────────────────
  // Actual order in 04-concurrency.ts:
  // 01_goroutines, 02_waitgroup, 03_channels_basic, 04_buffered_channels,
  // 05_channel_direction, 06_range_channel, 07_select_basic, 08_select_default,
  // 09_select_timeout, 10_mutex, 11_rwmutex, 12_once, 13_atomic,
  // 14_context_basic … 25_graceful_shutdown
  'conc_01_goroutines':       ['basics_09_functions'],
  'conc_02_waitgroup':        ['conc_01_goroutines'],
  'conc_03_channels_basic':   ['conc_01_goroutines'],
  'conc_04_buffered_channels':['conc_03_channels_basic'],
  'conc_05_channel_direction':['conc_03_channels_basic'],
  'conc_06_range_channel':    ['conc_03_channels_basic', 'basics_17_for_range'],
  'conc_07_select_basic':     ['conc_03_channels_basic'],
  'conc_08_select_default':   ['conc_07_select_basic'],
  'conc_09_select_timeout':   ['conc_07_select_basic', 'errors_01_basics', 'stdlib_20_time_basics'],
  'conc_10_mutex':            ['conc_01_goroutines'],
  'conc_11_rwmutex':          ['conc_10_mutex'],
  'conc_12_once':             ['conc_10_mutex'],
  'conc_13_atomic':           ['conc_10_mutex'],
  'conc_14_context_basic':    ['conc_01_goroutines'],
  'conc_15_context_cancel':   ['conc_14_context_basic'],
  'conc_16_context_timeout':  ['conc_15_context_cancel', 'errors_01_basics', 'stdlib_20_time_basics'],
  'conc_17_context_values':   ['conc_14_context_basic'],
  'conc_18_worker_pool':      ['conc_02_waitgroup', 'conc_03_channels_basic'],
  'conc_19_fan_out':          ['conc_18_worker_pool'],
  'conc_20_fan_in':           ['conc_19_fan_out', 'conc_07_select_basic'],
  'conc_21_pipeline':         ['conc_19_fan_out', 'conc_20_fan_in'],
  'conc_22_semaphore':        ['conc_04_buffered_channels', 'conc_10_mutex'],
  'conc_23_rate_limiter':     ['conc_22_semaphore', 'stdlib_20_time_basics'],
  'conc_24_errgroup':         ['conc_02_waitgroup', 'errors_01_basics'],
  'conc_25_graceful_shutdown':['conc_14_context_basic', 'conc_07_select_basic', 'conc_10_mutex'],

  // ── Standard Library ─────────────────────────────────────────────────────
  'stdlib_01_fmt':          ['basics_02_variables'],
  'stdlib_02_strings':      ['basics_19_strings'],
  'stdlib_03_strconv':      ['basics_07_basic_types'],
  'stdlib_04_sort':         ['basics_23_slices'],
  'stdlib_05_io_reader':    ['types_01_interfaces'],
  'stdlib_06_io_writer':    ['stdlib_05_io_reader'],
  'stdlib_07_bufio':        ['stdlib_06_io_writer'],
  'stdlib_08_os_read':      ['stdlib_05_io_reader', 'stdlib_07_bufio'],
  'stdlib_09_os_write':     ['stdlib_06_io_writer'],
  'stdlib_10_filepath':     ['stdlib_08_os_read'],
  'stdlib_11_json_marshal':   ['basics_27_structs'],
  'stdlib_12_json_unmarshal': ['stdlib_11_json_marshal'],
  'stdlib_13_json_custom':    ['stdlib_12_json_unmarshal'],
  'stdlib_14_http_client':    ['stdlib_05_io_reader', 'errors_01_basics', 'stdlib_11_json_marshal'],
  'stdlib_15_http_server':    ['stdlib_14_http_client'],
  'stdlib_16_http_middleware':['stdlib_15_http_server'],
  'stdlib_17_html_template':  ['stdlib_15_http_server'],
  'stdlib_18_text_template':  ['stdlib_02_strings'],
  'stdlib_19_regexp':         ['stdlib_02_strings'],
  'stdlib_20_time_basics':    ['basics_09_functions', 'basics_27_structs'],
  'stdlib_21_time_ticker':    ['stdlib_20_time_basics', 'conc_03_channels_basic'],
  'stdlib_22_math_rand':      ['basics_09_functions'],
  'stdlib_23_crypto_hash':    ['stdlib_06_io_writer'],
  'stdlib_24_slog':           ['basics_27_structs'],
  'stdlib_25_testing':        ['basics_09_functions'],

  // ── Patterns ─────────────────────────────────────────────────────────────
  // Actual order in 06-patterns.ts:
  // 01_functional_options, 02_builder, 03_factory, 04_strategy, 05_observer,
  // 06_middleware, 07_decorator, 08_singleton, 09_repository, 10_dependency_injection,
  // 11_table_driven_tests, 12_test_fixtures, 13_mock_interfaces, 14_iterator,
  // 15_pubsub, 16_circuit_breaker, 17_retry_backoff, 18_graceful_shutdown,
  // 19_config_loading, 20_structured_logging, 21_health_check, 22_command,
  // 23_state_machine, 24_pool, 25_registry
  'patterns_01_functional_options':  ['basics_12_variadic', 'types_01_interfaces'],
  'patterns_02_builder':             ['basics_27_structs', 'basics_28_struct_methods'],
  'patterns_03_factory':             ['types_01_interfaces'],
  'patterns_04_strategy':            ['types_01_interfaces'],
  'patterns_05_observer':            ['types_01_interfaces', 'basics_23_slices'],
  'patterns_06_middleware':          ['stdlib_16_http_middleware'],
  'patterns_07_decorator':           ['types_01_interfaces'],
  'patterns_08_singleton':           ['conc_12_once'],
  'patterns_09_repository':          ['types_01_interfaces', 'errors_01_basics'],
  'patterns_10_dependency_injection':['patterns_09_repository'],
  'patterns_11_table_driven_tests':  ['stdlib_25_testing'],
  'patterns_12_test_fixtures':       ['patterns_11_table_driven_tests'],
  'patterns_13_mock_interfaces':     ['types_01_interfaces', 'patterns_11_table_driven_tests'],
  'patterns_14_iterator':            ['types_01_interfaces'],
  'patterns_15_pubsub':              ['conc_05_channel_direction', 'types_01_interfaces', 'conc_10_mutex'],
  'patterns_16_circuit_breaker':     ['errors_01_basics', 'conc_10_mutex', 'stdlib_20_time_basics'],
  'patterns_17_retry_backoff':       ['errors_01_basics', 'stdlib_20_time_basics'],
  'patterns_18_graceful_shutdown':   ['conc_25_graceful_shutdown', 'conc_10_mutex'],
  'patterns_19_config_loading':      ['stdlib_11_json_marshal', 'stdlib_08_os_read', 'stdlib_03_strconv'],
  'patterns_20_structured_logging':  ['stdlib_24_slog'],
  'patterns_21_health_check':        ['stdlib_15_http_server'],
  'patterns_22_command':             ['types_01_interfaces'],
  'patterns_23_state_machine':       ['basics_28_struct_methods', 'errors_01_basics', 'basics_24_maps'],
  'patterns_24_pool':                ['conc_11_rwmutex', 'basics_23_slices', 'errors_01_basics'],
  'patterns_25_registry':            ['basics_24_maps', 'types_01_interfaces', 'errors_01_basics', 'stdlib_04_sort'],

  // ── Internals ─────────────────────────────────────────────────────────────
  // Actual order in 07-internals.ts:
  // 01_memory_layout, 02_slice_header, 03_slice_growth, 04_map_internals,
  // 05_string_internals, 06_interface_internals, 07_goroutine_stack,
  // 08_escape_analysis, 09_alignment, 10_gc_finalizers, 11_unsafe_pointer,
  // 12_reflect_basics, 13_reflect_set, 14_struct_tags, 15_build_tags,
  // 16_code_generation, 17_linker_flags, 18_race_detection,
  // 19_compiler_directives, 20_runtime_info
  'internals_01_memory_layout':      ['basics_27_structs', 'basics_29_pointers', 'types_01_interfaces'],
  'internals_02_slice_header':       ['basics_23_slices'],
  'internals_03_slice_growth':       ['internals_02_slice_header'],
  'internals_04_map_internals':      ['basics_24_maps', 'basics_25_map_operations'],
  'internals_05_string_internals':   ['basics_20_runes'],
  'internals_06_interface_internals':['types_01_interfaces'],
  'internals_07_goroutine_stack':    ['conc_01_goroutines', 'conc_02_waitgroup', 'conc_10_mutex'],
  'internals_08_escape_analysis':    ['basics_29_pointers'],
  'internals_09_alignment':          ['internals_01_memory_layout'],
  'internals_10_gc_finalizers':      ['basics_29_pointers'],
  'internals_11_unsafe_pointer':     ['basics_29_pointers', 'internals_01_memory_layout'],
  'internals_12_reflect_basics':     ['types_04_type_assertions'],
  'internals_13_reflect_set':        ['internals_12_reflect_basics'],
  'internals_14_struct_tags':        ['basics_27_structs', 'internals_12_reflect_basics'],
  'internals_15_build_tags':         ['basics_27_structs', 'errors_01_basics'],
  'internals_16_code_generation':    ['basics_27_structs', 'stdlib_18_text_template'],
  'internals_17_linker_flags':       ['basics_27_structs', 'errors_01_basics'],
  'internals_18_race_detection':     ['conc_10_mutex'],
  'internals_19_compiler_directives':['basics_27_structs', 'stdlib_02_strings'],
  'internals_20_runtime_info':       ['conc_01_goroutines', 'basics_27_structs', 'stdlib_20_time_basics'],

  // ── Networking ───────────────────────────────────────────────────────────
  // Actual order in 08-networking.ts:
  // 01_tcp_server, 02_http_handler, 03_http_middleware, 04_rest_crud,
  // 05_http_client, 06_connection_pool, 07_rate_limiter, 08_load_balancer,
  // 09_websocket, 10_tls_config, 11_reverse_proxy, 12_grpc_like,
  // 13_service_discovery, 14_health_check, 15_circuit_breaker_http
  'net_01_tcp_server':          ['conc_01_goroutines', 'errors_01_basics', 'stdlib_05_io_reader', 'stdlib_07_bufio'],
  'net_02_http_handler':        ['stdlib_15_http_server'],
  'net_03_http_middleware':     ['net_02_http_handler'],
  'net_04_rest_crud':           ['net_02_http_handler', 'stdlib_11_json_marshal', 'conc_11_rwmutex'],
  'net_05_http_client':         ['stdlib_14_http_client', 'stdlib_20_time_basics'],
  'net_06_connection_pool':     ['patterns_24_pool', 'errors_01_basics'],
  'net_07_rate_limiter':        ['conc_23_rate_limiter', 'net_02_http_handler', 'stdlib_20_time_basics'],
  'net_08_load_balancer':       ['net_01_tcp_server', 'conc_10_mutex'],
  'net_09_websocket':           ['net_01_tcp_server'],
  'net_10_tls_config':          ['net_01_tcp_server'],
  'net_11_reverse_proxy':       ['net_05_http_client', 'net_02_http_handler'],
  'net_12_grpc_like':           ['net_01_tcp_server'],
  'net_13_service_discovery':   ['net_01_tcp_server', 'basics_24_maps', 'stdlib_04_sort', 'conc_10_mutex'],
  'net_14_health_check':        ['net_02_http_handler'],
  'net_15_circuit_breaker_http':['patterns_16_circuit_breaker', 'net_02_http_handler', 'stdlib_20_time_basics'],

  // ── Data & Storage ───────────────────────────────────────────────────────
  // Actual order in 09-data-storage.ts:
  // 01_kv_store, 02_kv_ttl, 03_lru_cache, 04_ring_buffer, 05_bloom_filter,
  // 06_skip_list, 07_wal, 08_consistent_hashing, 09_event_store,
  // 10_merkle_tree, 11_generic_pool, 12_query_engine, 13_transaction_log,
  // 14_inverted_index, 15_column_store
  'data_01_kv_store':          ['conc_11_rwmutex', 'basics_24_maps'],
  'data_02_kv_ttl':            ['data_01_kv_store', 'stdlib_20_time_basics'],
  'data_03_lru_cache':         ['data_01_kv_store', 'basics_24_maps'],
  'data_04_ring_buffer':       ['basics_22_arrays'],
  'data_05_bloom_filter':      ['basics_22_arrays', 'stdlib_23_crypto_hash'],
  'data_06_skip_list':         ['basics_27_structs', 'basics_29_pointers'],
  'data_07_wal':               ['stdlib_09_os_write', 'conc_10_mutex'],
  'data_08_consistent_hashing':['basics_23_slices', 'stdlib_04_sort', 'stdlib_03_strconv'],
  'data_09_event_store':       ['conc_11_rwmutex', 'basics_23_slices', 'stdlib_03_strconv', 'stdlib_20_time_basics'],
  'data_10_merkle_tree':       ['stdlib_23_crypto_hash', 'basics_27_structs'],
  'data_11_generic_pool':      ['types_11_generic_functions', 'conc_10_mutex'],
  'data_12_query_engine':      ['basics_23_slices', 'basics_24_maps', 'stdlib_03_strconv', 'stdlib_04_sort'],
  'data_13_transaction_log':   ['data_07_wal', 'errors_01_basics'],
  'data_14_inverted_index':    ['basics_24_maps', 'stdlib_02_strings', 'stdlib_04_sort'],
  'data_15_column_store':      ['data_12_query_engine', 'errors_01_basics', 'stdlib_03_strconv'],

  // ── Projects ─────────────────────────────────────────────────────────────
  'proj-cli-01': ['basics_27_structs', 'basics_24_maps', 'stdlib_02_strings', 'stdlib_03_strconv'],
  'proj-cli-02': ['proj-cli-01'],
  'proj-cli-03': ['proj-cli-02'],
  'proj-cli-04': ['proj-cli-03'],
  'proj-cli-05': ['proj-cli-04'],
  'proj-cli-06': ['proj-cli-05'],

  'proj-sub-01': ['basics_27_structs', 'basics_24_maps', 'errors_01_basics'],
  'proj-sub-02': ['proj-sub-01'],
  'proj-sub-03': ['proj-sub-02'],
  'proj-sub-04': ['proj-sub-03'],
  'proj-sub-05': ['proj-sub-04'],

  'proj-rest-01': ['conc_11_rwmutex', 'basics_24_maps'],
  'proj-rest-02': ['proj-rest-01', 'stdlib_11_json_marshal', 'stdlib_15_http_server'],
  'proj-rest-03': ['proj-rest-02'],
  'proj-rest-04': ['proj-rest-03', 'stdlib_02_strings'],
  'proj-rest-05': ['proj-rest-04'],
  'proj-rest-06': ['proj-rest-05'],

  'proj-lex-01': ['basics_27_structs', 'basics_20_runes', 'types_07_custom_types', 'basics_15_switch_no_condition'],
  'proj-lex-02': ['proj-lex-01', 'basics_16_for_loop'],
  'proj-lex-03': ['proj-lex-02'],
  'proj-lex-04': ['proj-lex-03'],
  'proj-lex-05': ['proj-lex-04'],
  'proj-lex-06': ['proj-lex-05'],

  'proj-queue-01': ['errors_01_basics', 'basics_27_structs', 'basics_28_struct_methods'],
  'proj-queue-02': ['proj-queue-01', 'conc_03_channels_basic'],
  'proj-queue-03': ['proj-queue-02', 'conc_02_waitgroup'],
  'proj-queue-04': ['proj-queue-03'],
  'proj-queue-05': ['proj-queue-04'],
  'proj-queue-06': ['proj-queue-05'],

  'proj-kv-01': ['conc_11_rwmutex', 'basics_24_maps'],
  'proj-kv-02': ['proj-kv-01', 'stdlib_02_strings'],
  'proj-kv-03': ['proj-kv-02', 'net_01_tcp_server'],

  // new projects
  'proj-watcher-01': ['stdlib_08_os_read'],
  'proj-watcher-02': ['proj-watcher-01', 'conc_03_channels_basic'],
  'proj-watcher-03': ['proj-watcher-02', 'conc_02_waitgroup'],

  'proj-log-01': ['basics_27_structs', 'stdlib_20_time_basics'],
  'proj-log-02': ['proj-log-01', 'conc_11_rwmutex'],
  'proj-log-03': ['proj-log-02', 'stdlib_08_os_write'],

  'proj-git-01': ['stdlib_23_crypto_hash'],
  'proj-git-02': ['proj-git-01'],
  'proj-git-03': ['proj-git-02', 'stdlib_08_os_write'],

  'proj-container-01': ['basics_27_structs', 'basics_24_maps'],
  'proj-container-02': ['proj-container-01', 'conc_11_rwmutex'],
  'proj-container-03': ['proj-container-02'],

  // ── Monkey Interpreter (22 steps) ──────────────────────────────────────────
  // Phase 1: Lexer (Steps 1-6)
  'proj-monkey-01': ['basics_27_structs', 'basics_24_maps', 'types_07_custom_types', 'basics_15_switch_no_condition'],
  'proj-monkey-02': ['proj-monkey-01'],
  'proj-monkey-03': ['proj-monkey-02'],
  'proj-monkey-04': ['proj-monkey-03'],
  'proj-monkey-05': ['proj-monkey-04'],
  'proj-monkey-06': ['proj-monkey-05'],

  // Phase 2: Parser (Steps 7-14)
  'proj-monkey-07': ['proj-monkey-06', 'basics_09_functions'],
  'proj-monkey-08': ['proj-monkey-07'],
  'proj-monkey-09': ['proj-monkey-08'],
  'proj-monkey-10': ['proj-monkey-09'],
  'proj-monkey-11': ['proj-monkey-10'],
  'proj-monkey-12': ['proj-monkey-11', 'basics_13_if_else'],
  'proj-monkey-13': ['proj-monkey-12'],
  'proj-monkey-14': ['proj-monkey-13'],

  // Phase 3: Evaluator (Steps 15-22)
  'proj-monkey-15': ['proj-monkey-14', 'basics_02_variables'],
  'proj-monkey-16': ['proj-monkey-15'],
  'proj-monkey-17': ['proj-monkey-16'],
  'proj-monkey-18': ['proj-monkey-17'],
  'proj-monkey-19': ['proj-monkey-18', 'basics_13_if_else'],
  'proj-monkey-20': ['proj-monkey-19', 'basics_24_maps'],
  'proj-monkey-21': ['proj-monkey-20'],
  'proj-monkey-22': ['proj-monkey-21'],
}

// ── Exercise titles (verified against actual files) ───────────────────────
const EXERCISE_TITLES: Record<string, string> = {
  'basics_01_hello': 'Hello World', 'basics_02_variables': 'Variables',
  'basics_03_short_declaration': 'Short Declaration', 'basics_04_zero_values': 'Zero Values',
  'basics_05_constants': 'Constants', 'basics_06_iota': 'Iota',
  'basics_07_basic_types': 'Basic Types', 'basics_08_type_conversion': 'Type Conversion',
  'basics_09_functions': 'Functions', 'basics_10_multiple_returns': 'Multiple Returns',
  'basics_11_named_returns': 'Named Returns', 'basics_12_variadic': 'Variadic Functions',
  'basics_13_if_else': 'If/Else', 'basics_14_switch': 'Switch',
  'basics_15_switch_no_condition': 'Switch (No Condition)', 'basics_16_for_loop': 'For Loop',
  'basics_17_for_range': 'For Range', 'basics_18_while_loop': 'While Loop',
  'basics_19_strings': 'Strings', 'basics_20_runes': 'Runes',
  'basics_21_string_builder': 'String Builder', 'basics_22_arrays': 'Arrays',
  'basics_23_slices': 'Slices', 'basics_26_slice_operations': 'Slice Operations',
  'basics_24_maps': 'Maps', 'basics_25_map_operations': 'Map Operations',
  'basics_27_structs': 'Structs', 'basics_28_struct_methods': 'Struct Methods',
  'basics_29_pointers': 'Pointers', 'basics_30_pointers_and_structs': 'Pointers and Structs',

  'types_01_interfaces': 'Interfaces', 'types_02_implicit_implementation': 'Implicit Implementation',
  'types_03_interface_composition': 'Interface Composition', 'types_04_type_assertions': 'Type Assertions',
  'types_05_type_switch': 'Type Switch', 'types_06_empty_interface': 'Empty Interface',
  'types_07_custom_types': 'Custom Types', 'types_08_type_aliases': 'Type Aliases',
  'types_09_stringer_interface': 'Stringer Interface', 'types_10_error_interface': 'Error Interface',
  'types_11_generic_functions': 'Generic Functions', 'types_12_generic_types': 'Generic Types',
  'types_13_generic_constraints': 'Generic Constraints', 'types_14_type_sets': 'Type Sets',
  'types_15_struct_embedding': 'Struct Embedding', 'types_16_interface_embedding': 'Interface Embedding',
  'types_17_comparable_constraint': 'Comparable Constraint', 'types_18_method_sets': 'Method Sets',
  'types_19_type_parameters': 'Type Parameters', 'types_20_constraints_package': 'Constraints Package',

  'errors_01_basics': 'Error Basics', 'errors_02_custom': 'Custom Errors',
  'errors_03_wrapping': 'Error Wrapping', 'errors_04_is': 'errors.Is',
  'errors_05_as': 'errors.As', 'errors_06_sentinel': 'Sentinel Errors',
  'errors_07_panic': 'Panic', 'errors_08_recover': 'Recover',
  'errors_09_defer_basics': 'Defer Basics', 'errors_10_defer_closures': 'Defer with Closures',
  'errors_11_defer_cleanup': 'Defer Cleanup', 'errors_12_strategies': 'Error Strategies',
  'errors_13_must': 'Must Pattern', 'errors_14_multi_error': 'Multi Error',
  'errors_15_hierarchy': 'Error Hierarchy',

  'conc_01_goroutines': 'Goroutines', 'conc_02_waitgroup': 'WaitGroup',
  'conc_03_channels_basic': 'Basic Channels', 'conc_04_buffered_channels': 'Buffered Channels',
  'conc_05_channel_direction': 'Channel Direction', 'conc_06_range_channel': 'Range over Channel',
  'conc_07_select_basic': 'Select', 'conc_08_select_default': 'Select Default',
  'conc_09_select_timeout': 'Select Timeout', 'conc_10_mutex': 'Mutex',
  'conc_11_rwmutex': 'RWMutex', 'conc_12_once': 'sync.Once',
  'conc_13_atomic': 'Atomic Operations', 'conc_14_context_basic': 'Context Basics',
  'conc_15_context_cancel': 'Context Cancellation', 'conc_16_context_timeout': 'Context Timeout',
  'conc_17_context_values': 'Context Values', 'conc_18_worker_pool': 'Worker Pool',
  'conc_19_fan_out': 'Fan-Out', 'conc_20_fan_in': 'Fan-In',
  'conc_21_pipeline': 'Pipeline', 'conc_22_semaphore': 'Semaphore',
  'conc_23_rate_limiter': 'Rate Limiter', 'conc_24_errgroup': 'errgroup',
  'conc_25_graceful_shutdown': 'Graceful Shutdown',

  'stdlib_01_fmt': 'fmt Package', 'stdlib_02_strings': 'strings Package',
  'stdlib_03_strconv': 'strconv Package', 'stdlib_04_sort': 'sort Package',
  'stdlib_05_io_reader': 'io.Reader', 'stdlib_06_io_writer': 'io.Writer',
  'stdlib_07_bufio': 'bufio Package', 'stdlib_08_os_read': 'OS File Reading',
  'stdlib_09_os_write': 'OS File Writing', 'stdlib_10_filepath': 'filepath Package',
  'stdlib_11_json_marshal': 'JSON Marshal', 'stdlib_12_json_unmarshal': 'JSON Unmarshal',
  'stdlib_13_json_custom': 'Custom JSON', 'stdlib_14_http_client': 'HTTP Client',
  'stdlib_15_http_server': 'HTTP Server', 'stdlib_16_http_middleware': 'HTTP Middleware',
  'stdlib_17_html_template': 'HTML Templates', 'stdlib_18_text_template': 'Text Templates',
  'stdlib_19_regexp': 'Regular Expressions', 'stdlib_20_time_basics': 'Time Basics',
  'stdlib_21_time_ticker': 'Time Ticker', 'stdlib_22_math_rand': 'math/rand',
  'stdlib_23_crypto_hash': 'crypto/hash', 'stdlib_24_slog': 'slog Package',
  'stdlib_25_testing': 'testing Package',

  'patterns_01_functional_options': 'Functional Options', 'patterns_02_builder': 'Builder Pattern',
  'patterns_03_factory': 'Factory Pattern', 'patterns_04_strategy': 'Strategy Pattern',
  'patterns_05_observer': 'Observer Pattern', 'patterns_06_middleware': 'Middleware Chain',
  'patterns_07_decorator': 'Decorator Pattern', 'patterns_08_singleton': 'Singleton',
  'patterns_09_repository': 'Repository Pattern', 'patterns_10_dependency_injection': 'Dependency Injection',
  'patterns_11_table_driven_tests': 'Table-Driven Tests', 'patterns_12_test_fixtures': 'Test Fixtures',
  'patterns_13_mock_interfaces': 'Mock Interfaces', 'patterns_14_iterator': 'Iterator Pattern',
  'patterns_15_pubsub': 'Pub/Sub', 'patterns_16_circuit_breaker': 'Circuit Breaker',
  'patterns_17_retry_backoff': 'Retry with Backoff', 'patterns_18_graceful_shutdown': 'Graceful Shutdown Pattern',
  'patterns_19_config_loading': 'Config Loading', 'patterns_20_structured_logging': 'Structured Logging',
  'patterns_21_health_check': 'Health Check', 'patterns_22_command': 'Command Pattern',
  'patterns_23_state_machine': 'State Machine', 'patterns_24_pool': 'Object Pool',
  'patterns_25_registry': 'Registry Pattern',

  'internals_01_memory_layout': 'Memory Layout', 'internals_02_slice_header': 'Slice Header',
  'internals_03_slice_growth': 'Slice Growth', 'internals_04_map_internals': 'Map Internals',
  'internals_05_string_internals': 'String Internals', 'internals_06_interface_internals': 'Interface Internals',
  'internals_07_goroutine_stack': 'Goroutine Stack', 'internals_08_escape_analysis': 'Escape Analysis',
  'internals_09_alignment': 'Struct Alignment', 'internals_10_gc_finalizers': 'GC & Finalizers',
  'internals_11_unsafe_pointer': 'Unsafe Pointer', 'internals_12_reflect_basics': 'Reflection Basics',
  'internals_13_reflect_set': 'Reflection Set', 'internals_14_struct_tags': 'Struct Tags',
  'internals_15_build_tags': 'Build Tags', 'internals_16_code_generation': 'Code Generation',
  'internals_17_linker_flags': 'Linker Flags', 'internals_18_race_detection': 'Race Detection',
  'internals_19_compiler_directives': 'Compiler Directives', 'internals_20_runtime_info': 'Runtime Info',

  'net_01_tcp_server': 'TCP Server', 'net_02_http_handler': 'HTTP Handler',
  'net_03_http_middleware': 'HTTP Middleware', 'net_04_rest_crud': 'REST CRUD API',
  'net_05_http_client': 'HTTP Client', 'net_06_connection_pool': 'Connection Pool',
  'net_07_rate_limiter': 'HTTP Rate Limiter', 'net_08_load_balancer': 'Load Balancer',
  'net_09_websocket': 'WebSocket', 'net_10_tls_config': 'TLS Config',
  'net_11_reverse_proxy': 'Reverse Proxy', 'net_12_grpc_like': 'gRPC-like Protocol',
  'net_13_service_discovery': 'Service Discovery', 'net_14_health_check': 'Health Check Endpoint',
  'net_15_circuit_breaker_http': 'HTTP Circuit Breaker',

  'data_01_kv_store': 'Key-Value Store', 'data_02_kv_ttl': 'KV Store with TTL',
  'data_03_lru_cache': 'LRU Cache', 'data_04_ring_buffer': 'Ring Buffer',
  'data_05_bloom_filter': 'Bloom Filter', 'data_06_skip_list': 'Skip List',
  'data_07_wal': 'Write-Ahead Log', 'data_08_consistent_hashing': 'Consistent Hashing',
  'data_09_event_store': 'Event Store', 'data_10_merkle_tree': 'Merkle Tree',
  'data_11_generic_pool': 'Generic Pool', 'data_12_query_engine': 'Query Engine',
  'data_13_transaction_log': 'Transaction Log', 'data_14_inverted_index': 'Inverted Index',
  'data_15_column_store': 'Column Store',

  'proj-cli-01': 'CLI Parser — Basic Flags', 'proj-cli-02': 'CLI Parser — Equals Syntax',
  'proj-cli-03': 'CLI Parser — Space Syntax', 'proj-cli-04': 'CLI Parser — Flag Parsing',
  'proj-cli-05': 'CLI Parser — Parse() and Lookup', 'proj-cli-06': 'CLI Parser — Usage, Vars & Capstone',
  'proj-sub-01': 'Subcommands — Registry', 'proj-sub-02': 'Subcommands — Dispatch',
  'proj-sub-03': 'Subcommands — Help System', 'proj-sub-04': 'Subcommands — Per-Command Flags',
  'proj-sub-05': 'Subcommands — Todo CLI Capstone',
  'proj-rest-01': 'REST API — In-Memory Store', 'proj-rest-02': 'REST API — GET & POST',
  'proj-rest-03': 'REST API — PUT & DELETE', 'proj-rest-04': 'REST API — Basic Auth',
  'proj-rest-05': 'REST API — Auth Middleware', 'proj-rest-06': 'REST API — Server & Graceful Shutdown (Capstone)',
  'proj-lex-01': 'Lexer — Single-Char Tokens', 'proj-lex-02': 'Lexer — Numbers & Identifiers',
  'proj-lex-03': 'Lexer — Whitespace Handling', 'proj-lex-04': 'Lexer — Full NextToken',
  'proj-lex-05': 'Lexer — Keyword Recognition', 'proj-lex-06': 'Lexer — Tokenize() Capstone',
  'proj-queue-01': 'Task Queue — Task & Result', 'proj-queue-02': 'Task Queue — Channel Submit',
  'proj-queue-03': 'Task Queue — Worker Pool', 'proj-queue-04': 'Task Queue — Collect Results',
  'proj-queue-05': 'Task Queue — Retry Logic', 'proj-queue-06': 'Task Queue — WorkerPool Capstone',
  'proj-kv-01': 'KV: Core Ops', 'proj-kv-02': 'KV: Protocol Parser',
  'proj-kv-03': 'KV: TCP Server',
  'proj-watcher-01': 'Watcher: Poll Files', 'proj-watcher-02': 'Watcher: Events Channel',
  'proj-watcher-03': 'Watcher: Multiple Listeners',
  'proj-log-01': 'Log: Entry & Level', 'proj-log-02': 'Log: Thread-Safe Store',
  'proj-log-03': 'Log: File Sink',
  'proj-git-01': 'Git: Hash Objects', 'proj-git-02': 'Git: Refs',
  'proj-git-03': 'Git: Object Store on Disk',
  'proj-container-01': 'Container: Namespace', 'proj-container-02': 'Container: Cgroup Limits',
  'proj-container-03': 'Container: Process Isolation',

  'proj-monkey-01': 'Lexer — Single-Character Tokens',
  'proj-monkey-02': 'Lexer — Numbers & Identifiers',
  'proj-monkey-03': 'Lexer — Whitespace Handling',
  'proj-monkey-04': 'Lexer — Keywords',
  'proj-monkey-05': 'Lexer — String Literals',
  'proj-monkey-06': 'Lexer — Multi-Character Operators',
  'proj-monkey-07': 'Parser — Integer & Boolean Literals',
  'proj-monkey-08': 'Parser — Prefix Expressions',
  'proj-monkey-09': 'Parser — Infix (Arithmetic)',
  'proj-monkey-10': 'Parser — Comparison Operators',
  'proj-monkey-11': 'Parser — Grouped Expressions',
  'proj-monkey-12': 'Parser — If-Else Expressions',
  'proj-monkey-13': 'Parser — Function Literals',
  'proj-monkey-14': 'Parser — Call Expressions (Capstone)',
  'proj-monkey-15': 'Evaluator — Integer & Boolean Values',
  'proj-monkey-16': 'Evaluator — Prefix Expressions',
  'proj-monkey-17': 'Evaluator — Arithmetic Operations',
  'proj-monkey-18': 'Evaluator — Comparison & Logical',
  'proj-monkey-19': 'Evaluator — If-Else & Truthiness',
  'proj-monkey-20': 'Evaluator — Environment & Variables',
  'proj-monkey-21': 'Evaluator — Functions & Closures',
  'proj-monkey-22': 'Evaluator — Capstone (Full Interpreter)',
}

// ── Prereq hints ─────────────────────────────────────────────────────────────
export const PREREQ_HINTS: Record<string, Array<{ text: string; exerciseId: string; exerciseTitle: string }>> = {
  'proj-cli-01': [
    { text: "Iterate over args with a for loop — review For Loop.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
    { text: "strings.HasPrefix detects the '-' prefix — see strings Package.", exerciseId: 'stdlib_02_strings', exerciseTitle: 'strings Package' },
  ],
  'proj-cli-02': [
    { text: "Use strings.Contains and SplitN to split on '=' — see strings Package.", exerciseId: 'stdlib_02_strings', exerciseTitle: 'strings Package' },
  ],
  'proj-cli-03': [
    { text: "Peek at args[i+1] using an index-based for loop — review For Loop.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
  ],
  'proj-sub-01': [
    { text: "Store handlers in a map[string]HandlerFn — see Maps.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
    { text: "Handlers are first-class function values — see Functions.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
  'proj-sub-02': [
    { text: "fmt.Errorf returns descriptive errors — see Error Basics.", exerciseId: 'errors_01_basics', exerciseTitle: 'Error Basics' },
  ],
  'proj-rest-01': [
    { text: "Protect the map with RWMutex — see RWMutex.", exerciseId: 'conc_11_rwmutex', exerciseTitle: 'RWMutex' },
    { text: "Map operations for get/set/delete — see Map Operations.", exerciseId: 'basics_25_map_operations', exerciseTitle: 'Map Operations' },
  ],
  'proj-rest-02': [
    { text: "Decode JSON request bodies — see JSON Unmarshal.", exerciseId: 'stdlib_12_json_unmarshal', exerciseTitle: 'JSON Unmarshal' },
    { text: "Register HTTP handlers — see HTTP Server.", exerciseId: 'stdlib_15_http_server', exerciseTitle: 'HTTP Server' },
  ],
  'proj-rest-03': [
    { text: "Extend the ServeHTTP switch with PUT/DELETE cases.", exerciseId: 'basics_14_switch', exerciseTitle: 'Switch' },
  ],
  'proj-rest-04': [
    { text: "Parse the Authorization header with strings.HasPrefix/TrimPrefix — see strings Package.", exerciseId: 'stdlib_02_strings', exerciseTitle: 'strings Package' },
  ],
  'proj-lex-01': [
    { text: "A switch on a byte value dispatches to token types — see Switch.", exerciseId: 'basics_14_switch', exerciseTitle: 'Switch' },
    { text: "Constants keep token type names readable — see Constants.", exerciseId: 'basics_05_constants', exerciseTitle: 'Constants' },
  ],
  'proj-lex-02': [
    { text: "Loop while IsDigit/IsLetter holds — see For Loop.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
    { text: "unicode.IsDigit works on rune values — see Runes.", exerciseId: 'basics_20_runes', exerciseTitle: 'Runes' },
  ],
  'proj-lex-03': [
    { text: "Skip space/tab/newline in a loop — see While Loop.", exerciseId: 'basics_18_while_loop', exerciseTitle: 'While Loop' },
  ],
  'proj-lex-04': [
    { text: "Check IsDigit then IsLetter then fall through to single chars.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
  ],
  'proj-cli-05': [
    { text: "Parse type indicators (int, string, bool) for CLI values — see Type Conversion.", exerciseId: 'basics_08_type_conversion', exerciseTitle: 'Type Conversion' },
  ],
  'proj-sub-04': [
    { text: "Global flags apply to all subcommands — store separately in Config struct.", exerciseId: 'basics_27_structs', exerciseTitle: 'Structs' },
  ],
  'proj-rest-05': [
    { text: "Return appropriate HTTP status codes for errors — see HTTP Server.", exerciseId: 'stdlib_15_http_server', exerciseTitle: 'HTTP Server' },
  ],
  'proj-lex-05': [
    { text: "Recognize reserved keywords (if, fn, let, return) — see Switch.", exerciseId: 'basics_14_switch', exerciseTitle: 'Switch' },
  ],
  'proj-queue-05': [
    { text: "Catch and report panics in workers with recover — see Recover.", exerciseId: 'errors_08_recover', exerciseTitle: 'Recover' },
  ],
  'proj-queue-01': [
    { text: "Task is a struct with ID and Work fields — see Structs.", exerciseId: 'basics_27_structs', exerciseTitle: 'Structs' },
    { text: "Work returns an error — see Error Basics.", exerciseId: 'errors_01_basics', exerciseTitle: 'Error Basics' },
  ],
  'proj-queue-02': [
    { text: "make(chan Task, size) creates a buffered channel — see Buffered Channels.", exerciseId: 'conc_04_buffered_channels', exerciseTitle: 'Buffered Channels' },
    { text: "close(ch) signals no more sends — see Basic Channels.", exerciseId: 'conc_03_channels_basic', exerciseTitle: 'Basic Channels' },
  ],
  'proj-queue-03': [
    { text: "wg.Add(1) + defer wg.Done() inside each goroutine — see WaitGroup.", exerciseId: 'conc_02_waitgroup', exerciseTitle: 'WaitGroup' },
    { text: "for task := range q.tasks loops until channel closes — see Range over Channel.", exerciseId: 'conc_06_range_channel', exerciseTitle: 'Range over Channel' },
  ],
  'proj-queue-04': [
    { text: "for r := range q.results drains after close — see Range over Channel.", exerciseId: 'conc_06_range_channel', exerciseTitle: 'Range over Channel' },
  ],
  'proj-kv-01': [
    { text: "Store data in map[string]string — see Maps.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
    { text: "Use RWMutex: Lock for writes, RLock for reads — see RWMutex.", exerciseId: 'conc_11_rwmutex', exerciseTitle: 'RWMutex' },
  ],
  'proj-kv-02': [
    { text: "strings.Fields splits on any whitespace — see strings Package.", exerciseId: 'stdlib_02_strings', exerciseTitle: 'strings Package' },
    { text: "Switch on the op string — see Switch.", exerciseId: 'basics_14_switch', exerciseTitle: 'Switch' },
  ],
  'proj-kv-03': [
    { text: "net.Listen + Accept pattern — see TCP Server.", exerciseId: 'net_01_tcp_server', exerciseTitle: 'TCP Server' },
    { text: "go handleConn(...) per connection — see Goroutines.", exerciseId: 'conc_01_goroutines', exerciseTitle: 'Goroutines' },
  ],
  'proj-watcher-01': [
    { text: "os.Stat gives file modification time — see OS File Reading.", exerciseId: 'stdlib_08_os_read', exerciseTitle: 'OS File Reading' },
  ],
  'proj-watcher-02': [
    { text: "Send events on a channel so callers can range over them — see Basic Channels.", exerciseId: 'conc_03_channels_basic', exerciseTitle: 'Basic Channels' },
  ],
  'proj-watcher-03': [
    { text: "Track multiple listener channels in a slice — see Slices.", exerciseId: 'basics_23_slices', exerciseTitle: 'Slices' },
    { text: "Protect the listeners slice with a mutex — see Mutex.", exerciseId: 'conc_10_mutex', exerciseTitle: 'Mutex' },
  ],
  'proj-log-01': [
    { text: "A log entry is a struct with Timestamp, Level, Message fields — see Structs.", exerciseId: 'basics_27_structs', exerciseTitle: 'Structs' },
    { text: "time.Now() gives the current timestamp — see Time Basics.", exerciseId: 'stdlib_20_time_basics', exerciseTitle: 'Time Basics' },
  ],
  'proj-log-02': [
    { text: "Protect the log slice with RWMutex — see RWMutex.", exerciseId: 'conc_11_rwmutex', exerciseTitle: 'RWMutex' },
  ],
  'proj-log-03': [
    { text: "Write entries to a file with os.OpenFile — see OS File Writing.", exerciseId: 'stdlib_09_os_write', exerciseTitle: 'OS File Writing' },
  ],
  'proj-git-01': [
    { text: "sha1.New() from crypto/sha1, write content, Sum(nil) — see crypto/hash.", exerciseId: 'stdlib_23_crypto_hash', exerciseTitle: 'crypto/hash' },
  ],
  'proj-git-02': [
    { text: "A ref is a named pointer to a hash — store in map[string]string — see Maps.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
  ],
  'proj-git-03': [
    { text: "Write objects to disk under a .git/objects path — see OS File Writing.", exerciseId: 'stdlib_09_os_write', exerciseTitle: 'OS File Writing' },
  ],
  'proj-container-01': [
    { text: "A namespace holds a map of processes — see Maps.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
  ],
  'proj-container-02': [
    { text: "Protect namespace state with RWMutex — see RWMutex.", exerciseId: 'conc_11_rwmutex', exerciseTitle: 'RWMutex' },
  ],
  // Advanced exercises
  'conc_21_pipeline': [
    { text: "Pipelines combine Fan-Out and Fan-In — review Fan-Out.", exerciseId: 'conc_19_fan_out', exerciseTitle: 'Fan-Out' },
    { text: "Fan-In merges channels — see Fan-In.", exerciseId: 'conc_20_fan_in', exerciseTitle: 'Fan-In' },
  ],
  'conc_24_errgroup': [
    { text: "errgroup wraps WaitGroup with error collection — see WaitGroup.", exerciseId: 'conc_02_waitgroup', exerciseTitle: 'WaitGroup' },
    { text: "Error handling across goroutines — see Error Basics.", exerciseId: 'errors_01_basics', exerciseTitle: 'Error Basics' },
  ],
  'patterns_16_circuit_breaker': [
    { text: "State transitions need mutex protection — see Mutex.", exerciseId: 'conc_10_mutex', exerciseTitle: 'Mutex' },
    { text: "Error thresholds — see Error Basics.", exerciseId: 'errors_01_basics', exerciseTitle: 'Error Basics' },
  ],
  'patterns_13_mock_interfaces': [
    { text: "Mocks implement the same interface — see Interfaces.", exerciseId: 'types_01_interfaces', exerciseTitle: 'Interfaces' },
    { text: "Table-driven tests drive mock usage — see Table-Driven Tests.", exerciseId: 'patterns_11_table_driven_tests', exerciseTitle: 'Table-Driven Tests' },
  ],
  'internals_11_unsafe_pointer': [
    { text: "Understand pointers before unsafe — see Pointers.", exerciseId: 'basics_29_pointers', exerciseTitle: 'Pointers' },
    { text: "Memory layout determines pointer arithmetic — see Memory Layout.", exerciseId: 'internals_01_memory_layout', exerciseTitle: 'Memory Layout' },
  ],
  'net_04_rest_crud': [
    { text: "Encode/decode JSON bodies — see JSON Marshal.", exerciseId: 'stdlib_11_json_marshal', exerciseTitle: 'JSON Marshal' },
    { text: "Protect the store with RWMutex — see RWMutex.", exerciseId: 'conc_11_rwmutex', exerciseTitle: 'RWMutex' },
  ],
  'data_05_bloom_filter': [
    { text: "Multiple hash functions — see crypto/hash.", exerciseId: 'stdlib_23_crypto_hash', exerciseTitle: 'crypto/hash' },
    { text: "Bit array as fixed-size array — see Arrays.", exerciseId: 'basics_22_arrays', exerciseTitle: 'Arrays' },
  ],
  'data_10_merkle_tree': [
    { text: "Hash each node — see crypto/hash.", exerciseId: 'stdlib_23_crypto_hash', exerciseTitle: 'crypto/hash' },
    { text: "Tree uses struct pointers — see Pointers.", exerciseId: 'basics_29_pointers', exerciseTitle: 'Pointers' },
  ],
  // Monkey Interpreter
  'proj-monkey-01': [
    { text: "Use a for loop to iterate through input bytes — see For Loop.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
    { text: "Byte literals like 'a' are of type byte — see Basic Types.", exerciseId: 'basics_07_basic_types', exerciseTitle: 'Basic Types' },
  ],
  'proj-monkey-02': [
    { text: "Helper functions isDigit() and isLetter() use unicode checks.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
  ],
  'proj-monkey-03': [
    { text: "skipWhitespace() advances past spaces/tabs/newlines.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
  ],
  'proj-monkey-04': [
    { text: "Use a map to lookup keywords — see Maps.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
  ],
  'proj-monkey-05': [
    { text: "Similar to readNumber() but handle quote delimiters.", exerciseId: 'basics_19_strings', exerciseTitle: 'Strings' },
  ],
  'proj-monkey-06': [
    { text: "Use peekChar() to look ahead without advancing position.", exerciseId: 'basics_16_for_loop', exerciseTitle: 'For Loop' },
  ],
  'proj-monkey-07': [
    { text: "Prefix expressions register with registerPrefix() — see Functions.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
  'proj-monkey-08': [
    { text: "PrefixExpression is a recursive structure — see Structs.", exerciseId: 'basics_27_structs', exerciseTitle: 'Structs' },
  ],
  'proj-monkey-09': [
    { text: "Infix operators need precedence levels — lower number = lower precedence.", exerciseId: 'basics_02_variables', exerciseTitle: 'Variables' },
  ],
  'proj-monkey-10': [
    { text: "Comparison operators return boolean — see If/Else.", exerciseId: 'basics_13_if_else', exerciseTitle: 'If/Else' },
  ],
  'proj-monkey-11': [
    { text: "Parentheses reset precedence — highest priority expressions.", exerciseId: 'basics_13_if_else', exerciseTitle: 'If/Else' },
  ],
  'proj-monkey-12': [
    { text: "If is an expression that returns a value — see If/Else.", exerciseId: 'basics_13_if_else', exerciseTitle: 'If/Else' },
  ],
  'proj-monkey-13': [
    { text: "Functions are first-class values — can be returned/assigned.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
  'proj-monkey-14': [
    { text: "CallExpression combines function and arguments — see Functions.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
  'proj-monkey-15': [
    { text: "Objects implement Inspect() for debugging — see Interfaces.", exerciseId: 'types_01_interfaces', exerciseTitle: 'Interfaces' },
  ],
  'proj-monkey-16': [
    { text: "Prefix evaluation applies operator to right operand.", exerciseId: 'basics_02_variables', exerciseTitle: 'Variables' },
  ],
  'proj-monkey-17': [
    { text: "Infix evaluation applies operator to left and right operands.", exerciseId: 'basics_02_variables', exerciseTitle: 'Variables' },
  ],
  'proj-monkey-18': [
    { text: "Comparisons always return TRUE or FALSE objects.", exerciseId: 'basics_02_variables', exerciseTitle: 'Variables' },
  ],
  'proj-monkey-19': [
    { text: "Truthiness in Monkey: false and null are falsy, rest are truthy — see If/Else.", exerciseId: 'basics_13_if_else', exerciseTitle: 'If/Else' },
  ],
  'proj-monkey-20': [
    { text: "Environment is map[string]Object — stores variable bindings.", exerciseId: 'basics_24_maps', exerciseTitle: 'Maps' },
  ],
  'proj-monkey-21': [
    { text: "Closures capture the enclosing environment — see Functions.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
  'proj-monkey-22': [
    { text: "Test complex programs with multiple statements and nested calls.", exerciseId: 'basics_09_functions', exerciseTitle: 'Functions' },
  ],
}

// ── computeStatus ────────────────────────────────────────────────────────────
export function computeStatus(
  allIds: string[],
  completed: Record<string, boolean>
): Record<string, 'locked' | 'available' | 'completed'> {
  const result: Record<string, 'locked' | 'available' | 'completed'> = {}
  for (const id of allIds) {
    if (completed[id]) { result[id] = 'completed'; continue }
    const prereqs = REQUIRES[id] ?? []
    result[id] = prereqs.every((req) => completed[req]) ? 'available' : 'locked'
  }
  return result
}

// ── computeLevels ─────────────────────────────────────────────────────────────
export function computeLevels(allIds: string[]): Record<string, number> {
  const levels: Record<string, number> = {}
  function getLevel(id: string, visited = new Set<string>()): number {
    if (id in levels) return levels[id]
    if (visited.has(id)) return 0
    const prereqs = REQUIRES[id] ?? []
    if (prereqs.length === 0) { levels[id] = 0; return 0 }
    visited.add(id)
    levels[id] = Math.max(...prereqs.map((p) => getLevel(p, new Set(visited)))) + 1
    return levels[id]
  }
  for (const id of allIds) getLevel(id)
  return levels
}
