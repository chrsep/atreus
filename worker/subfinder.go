package main

import (
	"bytes"
	"context"
	"github.com/projectdiscovery/subfinder/v2/pkg/passive"
	"github.com/projectdiscovery/subfinder/v2/pkg/resolve"
	"github.com/projectdiscovery/subfinder/v2/pkg/runner"
	"io"
	"io/ioutil"
	"os"
	"strings"
)

var subfinder *SubFinder

type SubFinder struct {
	runner *runner.Runner
	ctx    context.Context
}

func (s *SubFinder) Enumerate(domain string) ([]string, error) {
	buf := bytes.Buffer{}
	if err := s.runner.EnumerateSingleDomain(s.ctx, domain, []io.Writer{&buf}); err != nil {
		return nil, err
	}

	result, err := ioutil.ReadAll(&buf)
	if err != nil {
		return nil, err
	}

	return strings.Split(string(result), "\n"), nil
}

func setupSubfinder() {
	config := runner.ConfigFile{
		// Use the default list of resolvers by marshaling it to the config
		Resolvers: resolve.DefaultResolvers,
		// Use the default list of passive sources
		Sources: passive.DefaultSources,
		// Use the default list of all passive sources
		AllSources: passive.DefaultAllSources,
		// Use the default list of recursive sources
		Recursive:      passive.DefaultRecursiveSources,
		Binaryedge:     []string{os.Getenv("BINARYEDGE_KEY")},
		Chaos:          []string{os.Getenv("CHAOS_KEY")},
		SecurityTrails: []string{os.Getenv("SECURITYTRAILS_KEY")},
		Shodan:         []string{os.Getenv("SHODAN_KEY")},
		URLScan:        []string{os.Getenv("URLSCAN_KEY")},
		Virustotal:     []string{os.Getenv("VIRUSTOTAL_KEY")},
	}

	runnerInstance, err := runner.NewRunner(&runner.Options{
		Timeout:            30, // Timeout is the seconds to wait for sources to respond
		MaxEnumerationTime: 10, // MaxEnumerationTime is the maximum amount of time in mins to wait for enumeration
		YAMLConfig:         config,
	})
	if err != nil {
		panic(err)
	}

	ctx := context.Background()
	subfinder = &SubFinder{
		runner: runnerInstance,
		ctx:    ctx,
	}
}
