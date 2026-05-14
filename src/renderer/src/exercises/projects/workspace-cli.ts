import { WorkspaceProject } from '../../types'

const project: WorkspaceProject = {
  "projectId": "proj-cli",
  "title": "CLI Parser",
  "category": "Projects",
  "subcategory": "CLI Parser",
  "order": 10,
  "difficulty": "expert",
  "workspaceScaffold": {
    "goMod": "module cli-parser\n\ngo 1.21\n",
    "files": [
      {
        "name": "main.go",
        "content": "package main\n\n// ParseFlags parses command-line arguments in -key=value format.\n// It returns a map of flag names to their values.\n// Both -key=value and --key=value are supported.\nfunc ParseFlags(args []string) map[string]string {\n\t// TODO: Implement flag parsing\n\t// 1. Iterate over args\n\t// 2. Check if arg starts with \"-\" or \"--\"\n\t// 3. Split on \"=\" to get key and value\n\t// 4. Strip leading dashes from key\n\t// 5. Store in map\n\treturn nil\n}\n\nfunc main() {}\n"
      }
    ],
    "testFiles": []
  },
  "steps": [
    {
      "id": "proj-cli-01",
      "title": "Parse -key=value Syntax",
      "difficulty": "intermediate",
      "description": "Build a CLI argument parser from scratch! In this first step, implement a function that parses\nflags in the -key=value format.\n\n**Requirements:**\n- Implement ParseFlags(args []string) map[string]string\n- Parse arguments like \"-name=Alice\", \"-port=8080\"\n- Strip the leading dash from keys\n- Return a map of key-value pairs\n- Ignore arguments that don't match -key=value format\n- Handle flags with double dashes too: --name=Alice",
      "testFiles": [
        {
          "name": "step01_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc TestParseFlagsSingle(t *testing.T) {\n\targs := []string{\"-name=Alice\"}\n\tflags := ParseFlags(args)\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got name=%s\", flags[\"name\"])\n\t}\n}\n\nfunc TestParseFlagsMultiple(t *testing.T) {\n\targs := []string{\"-host=localhost\", \"-port=8080\", \"-debug=true\"}\n\tflags := ParseFlags(args)\n\tif flags[\"host\"] != \"localhost\" {\n\t\tt.Errorf(\"expected host=localhost, got host=%s\", flags[\"host\"])\n\t}\n\tif flags[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got port=%s\", flags[\"port\"])\n\t}\n\tif flags[\"debug\"] != \"true\" {\n\t\tt.Errorf(\"expected debug=true, got debug=%s\", flags[\"debug\"])\n\t}\n}\n\nfunc TestParseFlagsDoubleDash(t *testing.T) {\n\targs := []string{\"--output=result.txt\", \"--verbose=true\"}\n\tflags := ParseFlags(args)\n\tif flags[\"output\"] != \"result.txt\" {\n\t\tt.Errorf(\"expected output=result.txt, got output=%s\", flags[\"output\"])\n\t}\n\tif flags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected verbose=true, got verbose=%s\", flags[\"verbose\"])\n\t}\n}\n\nfunc TestParseFlagsIgnoresNonFlags(t *testing.T) {\n\targs := []string{\"hello\", \"-name=Alice\", \"world\"}\n\tflags := ParseFlags(args)\n\tif len(flags) != 1 {\n\t\tt.Errorf(\"expected 1 flag, got %d\", len(flags))\n\t}\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got name=%s\", flags[\"name\"])\n\t}\n}\n\nfunc TestParseFlagsEmpty(t *testing.T) {\n\tflags := ParseFlags([]string{})\n\tif len(flags) != 0 {\n\t\tt.Errorf(\"expected 0 flags, got %d\", len(flags))\n\t}\n}\n\nfunc TestParseFlagsValueWithEquals(t *testing.T) {\n\targs := []string{\"-expr=a=b\"}\n\tflags := ParseFlags(args)\n\tif flags[\"expr\"] != \"a=b\" {\n\t\tt.Errorf(\"expected expr=a=b, got expr=%s\", flags[\"expr\"])\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step01_test.go",
      "hints": [
        "Use strings.HasPrefix to check for \"-\" or \"--\"",
        "Use strings.TrimLeft(arg, \"-\") to strip leading dashes",
        "Use strings.Index to find the first \"=\" and split manually so values containing \"=\" are preserved"
      ],
      "solution": "",
      "requires": []
    },
    {
      "id": "proj-cli-02",
      "title": "Parse -key value Space Syntax",
      "difficulty": "intermediate",
      "description": "Extend the parser to handle space-separated flags like -name Alice in addition to -name=Alice.\n\n**Requirements:**\n- Support -key=value (from step 1)\n- Support -key value (space-separated, value is the next argument)\n- Support --key=value and --key value\n- Boolean flags like -verbose with no value get the value \"true\"\n- A bare \"--\" stops flag parsing (everything after is not a flag)",
      "testFiles": [
        {
          "name": "step02_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc TestEqualsStyle(t *testing.T) {\n\tflags := ParseFlags([]string{\"-name=Alice\", \"--port=8080\"})\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", flags[\"name\"])\n\t}\n\tif flags[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got %s\", flags[\"port\"])\n\t}\n}\n\nfunc TestSpaceStyle(t *testing.T) {\n\tflags := ParseFlags([]string{\"-name\", \"Alice\", \"-port\", \"8080\"})\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", flags[\"name\"])\n\t}\n\tif flags[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got %s\", flags[\"port\"])\n\t}\n}\n\nfunc TestMixedStyle(t *testing.T) {\n\tflags := ParseFlags([]string{\"-name=Alice\", \"-port\", \"8080\", \"--debug=true\"})\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", flags[\"name\"])\n\t}\n\tif flags[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got %s\", flags[\"port\"])\n\t}\n\tif flags[\"debug\"] != \"true\" {\n\t\tt.Errorf(\"expected debug=true, got %s\", flags[\"debug\"])\n\t}\n}\n\nfunc TestBooleanFlag(t *testing.T) {\n\tflags := ParseFlags([]string{\"-verbose\", \"-name\", \"Alice\"})\n\tif flags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected verbose=true, got %s\", flags[\"verbose\"])\n\t}\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", flags[\"name\"])\n\t}\n}\n\nfunc TestDoubleDashStop(t *testing.T) {\n\tflags := ParseFlags([]string{\"-name=Alice\", \"--\", \"-port=8080\"})\n\tif flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", flags[\"name\"])\n\t}\n\tif _, ok := flags[\"port\"]; ok {\n\t\tt.Errorf(\"port should not be parsed after --\")\n\t}\n}\n\nfunc TestBooleanFlagAtEnd(t *testing.T) {\n\tflags := ParseFlags([]string{\"-name\", \"Alice\", \"-verbose\"})\n\tif flags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected verbose=true, got %s\", flags[\"verbose\"])\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step02_test.go",
      "hints": [
        "Use an index-based loop so you can skip ahead when consuming the next arg as a value",
        "Check if the next argument starts with \"-\" to decide if the current flag is boolean",
        "Handle the \"--\" sentinel by breaking out of the loop"
      ],
      "solution": "package main\n\nimport \"strings\"\n\n// ParseFlags parses command-line arguments supporting both\n// -key=value and -key value syntax.\n// Boolean flags without values get \"true\".\n// A bare \"--\" stops flag parsing.\nfunc ParseFlags(args []string) map[string]string {\n\tflags := make(map[string]string)\n\ti := 0\n\tfor i < len(args) {\n\t\targ := args[i]\n\n\t\t// Stop on bare \"--\"\n\t\tif arg == \"--\" {\n\t\t\tbreak\n\t\t}\n\n\t\tif !strings.HasPrefix(arg, \"-\") {\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\n\t\ttrimmed := strings.TrimLeft(arg, \"-\")\n\n\t\t// Check for = syntax\n\t\tif eqIdx := strings.Index(trimmed, \"=\"); eqIdx >= 0 {\n\t\t\tkey := trimmed[:eqIdx]\n\t\t\tvalue := trimmed[eqIdx+1:]\n\t\t\tflags[key] = value\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\n\t\t// Space-separated: peek at next arg\n\t\tkey := trimmed\n\t\tif i+1 < len(args) && !strings.HasPrefix(args[i+1], \"-\") {\n\t\t\tflags[key] = args[i+1]\n\t\t\ti += 2\n\t\t} else {\n\t\t\t// Boolean flag\n\t\t\tflags[key] = \"true\"\n\t\t\ti++\n\t\t}\n\t}\n\treturn flags\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-cli-01"
      ]
    },
    {
      "id": "proj-cli-03",
      "title": "Positional Arguments",
      "difficulty": "intermediate",
      "description": "Extend the parser to separate flags from positional arguments.\n\n**Requirements:**\n- Return both flags and positional args via a ParseResult struct\n- Positional args are non-flag arguments (don't start with \"-\")\n- Arguments after \"--\" are all positional\n- Support both -key=value and -key value flag styles (from previous steps)",
      "testFiles": [
        {
          "name": "step03_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc TestParseOnlyFlags(t *testing.T) {\n\tr := Parse([]string{\"-name=Alice\", \"-port\", \"8080\"})\n\tif r.Flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", r.Flags[\"name\"])\n\t}\n\tif r.Flags[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got %s\", r.Flags[\"port\"])\n\t}\n\tif len(r.Positional) != 0 {\n\t\tt.Errorf(\"expected 0 positional args, got %d\", len(r.Positional))\n\t}\n}\n\nfunc TestParseOnlyPositional(t *testing.T) {\n\tr := Parse([]string{\"hello\", \"world\"})\n\tif len(r.Positional) != 2 {\n\t\tt.Fatalf(\"expected 2 positional args, got %d\", len(r.Positional))\n\t}\n\tif r.Positional[0] != \"hello\" || r.Positional[1] != \"world\" {\n\t\tt.Errorf(\"expected [hello, world], got %v\", r.Positional)\n\t}\n}\n\nfunc TestParseMixed(t *testing.T) {\n\tr := Parse([]string{\"-verbose\", \"build\", \"-output\", \"main\", \"extra\"})\n\tif r.Flags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected verbose=true, got %s\", r.Flags[\"verbose\"])\n\t}\n\tif r.Flags[\"output\"] != \"main\" {\n\t\tt.Errorf(\"expected output=main, got %s\", r.Flags[\"output\"])\n\t}\n\tif len(r.Positional) != 2 {\n\t\tt.Fatalf(\"expected 2 positional args, got %d\", len(r.Positional))\n\t}\n\tif r.Positional[0] != \"build\" || r.Positional[1] != \"extra\" {\n\t\tt.Errorf(\"expected [build, extra], got %v\", r.Positional)\n\t}\n}\n\nfunc TestParseDoubleDash(t *testing.T) {\n\tr := Parse([]string{\"-name=Alice\", \"--\", \"-not-a-flag\", \"file.txt\"})\n\tif r.Flags[\"name\"] != \"Alice\" {\n\t\tt.Errorf(\"expected name=Alice, got %s\", r.Flags[\"name\"])\n\t}\n\tif len(r.Positional) != 2 {\n\t\tt.Fatalf(\"expected 2 positional args after --, got %d\", len(r.Positional))\n\t}\n\tif r.Positional[0] != \"-not-a-flag\" {\n\t\tt.Errorf(\"expected -not-a-flag as positional, got %s\", r.Positional[0])\n\t}\n}\n\nfunc TestParseEmpty(t *testing.T) {\n\tr := Parse([]string{})\n\tif len(r.Flags) != 0 {\n\t\tt.Errorf(\"expected 0 flags, got %d\", len(r.Flags))\n\t}\n\tif len(r.Positional) != 0 {\n\t\tt.Errorf(\"expected 0 positional, got %d\", len(r.Positional))\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step03_test.go",
      "hints": [
        "Create a ParseResult struct with Flags (map) and Positional (slice) fields",
        "Non-flag arguments (not starting with \"-\") go into the Positional slice",
        "After encountering \"--\", append all remaining args to Positional"
      ],
      "solution": "package main\n\nimport \"strings\"\n\n// ParseResult holds the parsed flags and positional arguments.\ntype ParseResult struct {\n\tFlags      map[string]string\n\tPositional []string\n}\n\n// Parse parses command-line arguments into flags and positional args.\nfunc Parse(args []string) ParseResult {\n\tresult := ParseResult{\n\t\tFlags:      make(map[string]string),\n\t\tPositional: []string{},\n\t}\n\ti := 0\n\tfor i < len(args) {\n\t\targ := args[i]\n\n\t\t// Stop flag parsing on bare \"--\"\n\t\tif arg == \"--\" {\n\t\t\tresult.Positional = append(result.Positional, args[i+1:]...)\n\t\t\tbreak\n\t\t}\n\n\t\tif !strings.HasPrefix(arg, \"-\") {\n\t\t\tresult.Positional = append(result.Positional, arg)\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\n\t\ttrimmed := strings.TrimLeft(arg, \"-\")\n\n\t\t// Equals syntax\n\t\tif eqIdx := strings.Index(trimmed, \"=\"); eqIdx >= 0 {\n\t\t\tkey := trimmed[:eqIdx]\n\t\t\tvalue := trimmed[eqIdx+1:]\n\t\t\tresult.Flags[key] = value\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\n\t\t// Space-separated or boolean\n\t\tkey := trimmed\n\t\tif i+1 < len(args) && !strings.HasPrefix(args[i+1], \"-\") {\n\t\t\tresult.Flags[key] = args[i+1]\n\t\t\ti += 2\n\t\t} else {\n\t\t\tresult.Flags[key] = \"true\"\n\t\t\ti++\n\t\t}\n\t}\n\treturn result\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-cli-02"
      ]
    },
    {
      "id": "proj-cli-04",
      "title": "Subcommands",
      "difficulty": "advanced",
      "description": "Add subcommand support. The first positional argument is treated as a subcommand name, and remaining args are parsed for that subcommand.\n\n**Requirements:**\n- ParseWithSubcommand(args []string) SubcommandResult\n- The first positional argument becomes the subcommand name\n- Remaining args after the subcommand are parsed as flags/positional for that subcommand\n- If no subcommand is found, Subcommand is empty\n- Flags before the subcommand are \"global\" flags",
      "testFiles": [
        {
          "name": "step04_test.go",
          "content": "package main\n\nimport (\n\t\"testing\"\n)\n\nfunc TestSubcommandBasic(t *testing.T) {\n\tr := ParseWithSubcommand([]string{\"build\", \"-output\", \"main\"})\n\tif r.Subcommand != \"build\" {\n\t\tt.Errorf(\"expected subcommand=build, got %s\", r.Subcommand)\n\t}\n\tif r.SubFlags[\"output\"] != \"main\" {\n\t\tt.Errorf(\"expected output=main, got %s\", r.SubFlags[\"output\"])\n\t}\n}\n\nfunc TestSubcommandWithGlobalFlags(t *testing.T) {\n\tr := ParseWithSubcommand([]string{\"-verbose\", \"deploy\", \"-target=prod\"})\n\tif r.GlobalFlags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected global verbose=true, got %s\", r.GlobalFlags[\"verbose\"])\n\t}\n\tif r.Subcommand != \"deploy\" {\n\t\tt.Errorf(\"expected subcommand=deploy, got %s\", r.Subcommand)\n\t}\n\tif r.SubFlags[\"target\"] != \"prod\" {\n\t\tt.Errorf(\"expected target=prod, got %s\", r.SubFlags[\"target\"])\n\t}\n}\n\nfunc TestSubcommandWithPositional(t *testing.T) {\n\tr := ParseWithSubcommand([]string{\"test\", \"file1.go\", \"file2.go\"})\n\tif r.Subcommand != \"test\" {\n\t\tt.Errorf(\"expected subcommand=test, got %s\", r.Subcommand)\n\t}\n\tif len(r.SubPositional) != 2 {\n\t\tt.Fatalf(\"expected 2 sub-positional args, got %d\", len(r.SubPositional))\n\t}\n\tif r.SubPositional[0] != \"file1.go\" || r.SubPositional[1] != \"file2.go\" {\n\t\tt.Errorf(\"expected [file1.go file2.go], got %v\", r.SubPositional)\n\t}\n}\n\nfunc TestNoSubcommand(t *testing.T) {\n\tr := ParseWithSubcommand([]string{\"-verbose\", \"-debug=true\"})\n\tif r.Subcommand != \"\" {\n\t\tt.Errorf(\"expected empty subcommand, got %s\", r.Subcommand)\n\t}\n\tif r.GlobalFlags[\"verbose\"] != \"true\" {\n\t\tt.Errorf(\"expected verbose=true, got %s\", r.GlobalFlags[\"verbose\"])\n\t}\n\tif r.GlobalFlags[\"debug\"] != \"true\" {\n\t\tt.Errorf(\"expected debug=true, got %s\", r.GlobalFlags[\"debug\"])\n\t}\n}\n\nfunc TestSubcommandEmpty(t *testing.T) {\n\tr := ParseWithSubcommand([]string{})\n\tif r.Subcommand != \"\" {\n\t\tt.Errorf(\"expected empty subcommand, got %s\", r.Subcommand)\n\t}\n}\n\nfunc TestSubcommandMixed(t *testing.T) {\n\tr := ParseWithSubcommand([]string{\"-config=app.yaml\", \"run\", \"-port\", \"3000\", \"server\"})\n\tif r.GlobalFlags[\"config\"] != \"app.yaml\" {\n\t\tt.Errorf(\"expected config=app.yaml, got %s\", r.GlobalFlags[\"config\"])\n\t}\n\tif r.Subcommand != \"run\" {\n\t\tt.Errorf(\"expected subcommand=run, got %s\", r.Subcommand)\n\t}\n\tif r.SubFlags[\"port\"] != \"3000\" {\n\t\tt.Errorf(\"expected port=3000, got %s\", r.SubFlags[\"port\"])\n\t}\n\tif len(r.SubPositional) != 1 || r.SubPositional[0] != \"server\" {\n\t\tt.Errorf(\"expected [server], got %v\", r.SubPositional)\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step04_test.go",
      "hints": [
        "Split parsing into two phases: global flags first, then subcommand + its args",
        "The first non-flag argument is the subcommand name",
        "Reuse your flag-parsing logic for the subcommand arguments"
      ],
      "solution": "package main\n\nimport \"strings\"\n\n// SubcommandResult holds the parsed subcommand, global flags, and sub-args.\ntype SubcommandResult struct {\n\tGlobalFlags   map[string]string\n\tSubcommand    string\n\tSubFlags      map[string]string\n\tSubPositional []string\n}\n\n// parseFlags is a helper that parses flags and positional args from a slice.\nfunc parseFlags(args []string) (map[string]string, []string) {\n\tflags := make(map[string]string)\n\tpositional := []string{}\n\ti := 0\n\tfor i < len(args) {\n\t\targ := args[i]\n\t\tif arg == \"--\" {\n\t\t\tpositional = append(positional, args[i+1:]...)\n\t\t\tbreak\n\t\t}\n\t\tif !strings.HasPrefix(arg, \"-\") {\n\t\t\tpositional = append(positional, arg)\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\t\ttrimmed := strings.TrimLeft(arg, \"-\")\n\t\tif eqIdx := strings.Index(trimmed, \"=\"); eqIdx >= 0 {\n\t\t\tflags[trimmed[:eqIdx]] = trimmed[eqIdx+1:]\n\t\t\ti++\n\t\t\tcontinue\n\t\t}\n\t\tkey := trimmed\n\t\tif i+1 < len(args) && !strings.HasPrefix(args[i+1], \"-\") {\n\t\t\tflags[key] = args[i+1]\n\t\t\ti += 2\n\t\t} else {\n\t\t\tflags[key] = \"true\"\n\t\t\ti++\n\t\t}\n\t}\n\treturn flags, positional\n}\n\n// ParseWithSubcommand parses \"app [global-flags] subcmd [sub-flags] [sub-args]\".\nfunc ParseWithSubcommand(args []string) SubcommandResult {\n\tresult := SubcommandResult{\n\t\tGlobalFlags:   make(map[string]string),\n\t\tSubFlags:      make(map[string]string),\n\t\tSubPositional: []string{},\n\t}\n\n\t// Phase 1: collect global flags until first non-flag arg\n\ti := 0\n\tfor i < len(args) {\n\t\targ := args[i]\n\t\tif !strings.HasPrefix(arg, \"-\") {\n\t\t\tbreak\n\t\t}\n\t\ttrimmed := strings.TrimLeft(arg, \"-\")\n\t\tif eqIdx := strings.Index(trimmed, \"=\"); eqIdx >= 0 {\n\t\t\tresult.GlobalFlags[trimmed[:eqIdx]] = trimmed[eqIdx+1:]\n\t\t\ti++\n\t\t} else {\n\t\t\tresult.GlobalFlags[trimmed] = \"true\"\n\t\t\ti++\n\t\t}\n\t}\n\n\t// Phase 2: first non-flag arg is the subcommand\n\tif i < len(args) {\n\t\tresult.Subcommand = args[i]\n\t\ti++\n\t}\n\n\t// Phase 3: parse remaining as sub-flags and sub-positional\n\tif i < len(args) {\n\t\tresult.SubFlags, result.SubPositional = parseFlags(args[i:])\n\t}\n\n\treturn result\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-cli-03"
      ]
    },
    {
      "id": "proj-cli-05",
      "title": "Help Text Generation",
      "difficulty": "advanced",
      "description": "Add help text generation from flag definitions. Users should get useful help when they pass -h or --help.\n\n**Requirements:**\n- FlagDef struct with Name, Description, and Default fields\n- GenerateHelp(appName string, description string, flags []FlagDef) string\n- Help text should include: app description, usage line, and flag table\n- Each flag shows: --name  description (default: value)\n- Flags with no default omit the \"(default: ...)\" part",
      "testFiles": [
        {
          "name": "step05_test.go",
          "content": "package main\n\nimport (\n\t\"strings\"\n\t\"testing\"\n)\n\nfunc TestGenerateHelpBasic(t *testing.T) {\n\tflags := []FlagDef{\n\t\t{Name: \"port\", Description: \"Port to listen on\", Default: \"8080\"},\n\t\t{Name: \"host\", Description: \"Host to bind to\", Default: \"localhost\"},\n\t}\n\thelp := GenerateHelp(\"myapp\", \"A sample application\", flags)\n\n\tif !strings.Contains(help, \"A sample application\") {\n\t\tt.Error(\"help should contain app description\")\n\t}\n\tif !strings.Contains(help, \"Usage: myapp [flags]\") {\n\t\tt.Error(\"help should contain usage line\")\n\t}\n\tif !strings.Contains(help, \"Flags:\") {\n\t\tt.Error(\"help should contain Flags: header\")\n\t}\n\tif !strings.Contains(help, \"--port\") {\n\t\tt.Error(\"help should contain --port flag\")\n\t}\n\tif !strings.Contains(help, \"Port to listen on\") {\n\t\tt.Error(\"help should contain port description\")\n\t}\n\tif !strings.Contains(help, \"(default: 8080)\") {\n\t\tt.Error(\"help should contain port default\")\n\t}\n}\n\nfunc TestGenerateHelpNoDefault(t *testing.T) {\n\tflags := []FlagDef{\n\t\t{Name: \"config\", Description: \"Config file path\", Default: \"\"},\n\t}\n\thelp := GenerateHelp(\"app\", \"Test app\", flags)\n\n\tif strings.Contains(help, \"(default:\") {\n\t\tt.Error(\"flags with empty default should not show (default: ...)\")\n\t}\n\tif !strings.Contains(help, \"--config\") {\n\t\tt.Error(\"help should contain --config flag\")\n\t}\n}\n\nfunc TestGenerateHelpNoFlags(t *testing.T) {\n\thelp := GenerateHelp(\"tool\", \"A simple tool\", []FlagDef{})\n\n\tif !strings.Contains(help, \"A simple tool\") {\n\t\tt.Error(\"help should contain description\")\n\t}\n\tif !strings.Contains(help, \"Usage: tool [flags]\") {\n\t\tt.Error(\"help should contain usage line\")\n\t}\n}\n\nfunc TestGenerateHelpMultipleFlags(t *testing.T) {\n\tflags := []FlagDef{\n\t\t{Name: \"verbose\", Description: \"Enable verbose output\", Default: \"false\"},\n\t\t{Name: \"output\", Description: \"Output file\", Default: \"\"},\n\t\t{Name: \"timeout\", Description: \"Request timeout\", Default: \"30s\"},\n\t}\n\thelp := GenerateHelp(\"cli\", \"CLI tool\", flags)\n\n\tif !strings.Contains(help, \"--verbose\") {\n\t\tt.Error(\"missing --verbose\")\n\t}\n\tif !strings.Contains(help, \"--output\") {\n\t\tt.Error(\"missing --output\")\n\t}\n\tif !strings.Contains(help, \"--timeout\") {\n\t\tt.Error(\"missing --timeout\")\n\t}\n\tif !strings.Contains(help, \"(default: 30s)\") {\n\t\tt.Error(\"missing timeout default\")\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step05_test.go",
      "hints": [
        "Build the help string line by line using fmt.Sprintf",
        "Only append \"(default: ...)\" when Default is not empty",
        "Use \\t between the flag name and description for alignment"
      ],
      "solution": "package main\n\nimport \"fmt\"\n\n// FlagDef describes a registered flag for help generation.\ntype FlagDef struct {\n\tName        string\n\tDescription string\n\tDefault     string\n}\n\n// GenerateHelp produces a help string from app metadata and flag definitions.\nfunc GenerateHelp(appName string, description string, flags []FlagDef) string {\n\tresult := description + \"\\n\\n\"\n\tresult += fmt.Sprintf(\"Usage: %s [flags]\\n\", appName)\n\n\tif len(flags) > 0 {\n\t\tresult += \"\\nFlags:\\n\"\n\t\tfor _, f := range flags {\n\t\t\tline := fmt.Sprintf(\"  --%s\\t%s\", f.Name, f.Description)\n\t\t\tif f.Default != \"\" {\n\t\t\t\tline += fmt.Sprintf(\" (default: %s)\", f.Default)\n\t\t\t}\n\t\t\tresult += line + \"\\n\"\n\t\t}\n\t}\n\treturn result\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-cli-04"
      ]
    },
    {
      "id": "proj-cli-06",
      "title": "Flag Validation & Defaults",
      "difficulty": "expert",
      "description": "Add flag validation, required flags, and default values. This is the capstone step for the CLI parser.\n\n**Requirements:**\n- FlagSpec struct: Name, Required (bool), Default, Validate func(string) error\n- ValidateFlags(specs []FlagSpec, provided map[string]string) (map[string]string, error)\n- Apply defaults for missing non-required flags\n- Return error if a required flag is missing\n- Run the Validate function if provided; return its error on failure\n- Return the final merged map of flag values",
      "testFiles": [
        {
          "name": "step06_test.go",
          "content": "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n\t\"strings\"\n\t\"testing\"\n)\n\nfunc TestValidateDefaults(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"port\", Default: \"8080\"},\n\t\t{Name: \"host\", Default: \"localhost\"},\n\t}\n\tresult, err := ValidateFlags(specs, map[string]string{})\n\tif err != nil {\n\t\tt.Fatalf(\"unexpected error: %v\", err)\n\t}\n\tif result[\"port\"] != \"8080\" {\n\t\tt.Errorf(\"expected port=8080, got %s\", result[\"port\"])\n\t}\n\tif result[\"host\"] != \"localhost\" {\n\t\tt.Errorf(\"expected host=localhost, got %s\", result[\"host\"])\n\t}\n}\n\nfunc TestValidateProvidedOverridesDefault(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"port\", Default: \"8080\"},\n\t}\n\tresult, err := ValidateFlags(specs, map[string]string{\"port\": \"3000\"})\n\tif err != nil {\n\t\tt.Fatalf(\"unexpected error: %v\", err)\n\t}\n\tif result[\"port\"] != \"3000\" {\n\t\tt.Errorf(\"expected port=3000, got %s\", result[\"port\"])\n\t}\n}\n\nfunc TestValidateRequired(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"token\", Required: true},\n\t}\n\t_, err := ValidateFlags(specs, map[string]string{})\n\tif err == nil {\n\t\tt.Fatal(\"expected error for missing required flag\")\n\t}\n\tif !strings.Contains(err.Error(), \"token\") {\n\t\tt.Errorf(\"error should mention flag name: %v\", err)\n\t}\n}\n\nfunc TestValidateRequiredProvided(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"token\", Required: true},\n\t}\n\tresult, err := ValidateFlags(specs, map[string]string{\"token\": \"abc123\"})\n\tif err != nil {\n\t\tt.Fatalf(\"unexpected error: %v\", err)\n\t}\n\tif result[\"token\"] != \"abc123\" {\n\t\tt.Errorf(\"expected token=abc123, got %s\", result[\"token\"])\n\t}\n}\n\nfunc TestValidateCustomValidator(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"port\", Default: \"8080\", Validate: func(v string) error {\n\t\t\tn, err := strconv.Atoi(v)\n\t\t\tif err != nil {\n\t\t\t\treturn fmt.Errorf(\"port must be a number\")\n\t\t\t}\n\t\t\tif n < 1 || n > 65535 {\n\t\t\t\treturn fmt.Errorf(\"port must be between 1 and 65535\")\n\t\t\t}\n\t\t\treturn nil\n\t\t}},\n\t}\n\t_, err := ValidateFlags(specs, map[string]string{\"port\": \"abc\"})\n\tif err == nil {\n\t\tt.Fatal(\"expected validation error\")\n\t}\n\tif !strings.Contains(err.Error(), \"port\") {\n\t\tt.Errorf(\"error should mention flag name: %v\", err)\n\t}\n}\n\nfunc TestValidateValidatorPasses(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"port\", Validate: func(v string) error {\n\t\t\t_, err := strconv.Atoi(v)\n\t\t\treturn err\n\t\t}},\n\t}\n\tresult, err := ValidateFlags(specs, map[string]string{\"port\": \"3000\"})\n\tif err != nil {\n\t\tt.Fatalf(\"unexpected error: %v\", err)\n\t}\n\tif result[\"port\"] != \"3000\" {\n\t\tt.Errorf(\"expected port=3000, got %s\", result[\"port\"])\n\t}\n}\n\nfunc TestValidateMixedScenario(t *testing.T) {\n\tspecs := []FlagSpec{\n\t\t{Name: \"host\", Default: \"localhost\"},\n\t\t{Name: \"port\", Required: true, Validate: func(v string) error {\n\t\t\t_, err := strconv.Atoi(v)\n\t\t\treturn err\n\t\t}},\n\t\t{Name: \"debug\", Default: \"false\"},\n\t}\n\tresult, err := ValidateFlags(specs, map[string]string{\"port\": \"9090\", \"debug\": \"true\"})\n\tif err != nil {\n\t\tt.Fatalf(\"unexpected error: %v\", err)\n\t}\n\tif result[\"host\"] != \"localhost\" {\n\t\tt.Errorf(\"expected host=localhost, got %s\", result[\"host\"])\n\t}\n\tif result[\"port\"] != \"9090\" {\n\t\tt.Errorf(\"expected port=9090, got %s\", result[\"port\"])\n\t}\n\tif result[\"debug\"] != \"true\" {\n\t\tt.Errorf(\"expected debug=true, got %s\", result[\"debug\"])\n\t}\n}\n"
        }
      ],
      "testRunPattern": "step06_test.go",
      "hints": [
        "Copy the provided map first so you do not mutate the input",
        "Check Required before applying Default -- a required flag with no value is an error",
        "Only run Validate when the flag actually has a value (provided or defaulted)"
      ],
      "solution": "package main\n\nimport \"fmt\"\n\n// FlagSpec defines a flag with validation rules.\ntype FlagSpec struct {\n\tName     string\n\tRequired bool\n\tDefault  string\n\tValidate func(string) error\n}\n\n// ValidateFlags checks provided flags against specs, applies defaults, and validates.\nfunc ValidateFlags(specs []FlagSpec, provided map[string]string) (map[string]string, error) {\n\tresult := make(map[string]string)\n\t// Copy provided flags\n\tfor k, v := range provided {\n\t\tresult[k] = v\n\t}\n\n\tfor _, spec := range specs {\n\t\tval, exists := result[spec.Name]\n\n\t\tif !exists {\n\t\t\tif spec.Required {\n\t\t\t\treturn nil, fmt.Errorf(\"required flag --%s is missing\", spec.Name)\n\t\t\t}\n\t\t\tif spec.Default != \"\" {\n\t\t\t\tresult[spec.Name] = spec.Default\n\t\t\t\tval = spec.Default\n\t\t\t\texists = true\n\t\t\t}\n\t\t}\n\n\t\tif exists && spec.Validate != nil {\n\t\t\tif err := spec.Validate(val); err != nil {\n\t\t\t\treturn nil, fmt.Errorf(\"invalid value for --%s: %w\", spec.Name, err)\n\t\t\t}\n\t\t}\n\t}\n\n\treturn result, nil\n}\n\nfunc main() {}\n",
      "requires": [
        "proj-cli-05"
      ]
    }
  ]
}

export default project
