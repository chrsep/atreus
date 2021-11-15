package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
)

func scanPorts(domains []string) error {
	cmd := exec.Command("httpx", "-json", "-silent")
	cmd.Stdin = strings.NewReader(strings.Join(domains, "\n"))

	var err bytes.Buffer
	var out bytes.Buffer
	cmd.Stderr = &err
	cmd.Stdout = &out

	_ = cmd.Run()

	var results []HTTPXResult
	for _, r := range strings.Split(out.String(), "\n") {
		if r == "" {
			continue
		}

		var result HTTPXResult
		err := json.Unmarshal([]byte(r), &result)
		if err != nil {
			return err
		}
		results = append(results, result)
	}

	fmt.Println(len(results))

	return nil
}

type HTTPXResult struct {
	Timestamp     string   `json:"timestamp"`
	Scheme        string   `json:"scheme"`
	Port          string   `json:"port"`
	Path          string   `json:"path"`
	BodySha256    string   `json:"body-sha256"`
	HeaderSha256  string   `json:"header-sha256"`
	A             []string `json:"a"`
	Cnames        []string `json:"cnames"`
	Url           string   `json:"url"`
	Input         string   `json:"input"`
	Title         string   `json:"title"`
	Webserver     string   `json:"webserver"`
	ContentType   string   `json:"content-type"`
	Method        string   `json:"method"`
	Host          string   `json:"host"`
	ContentLength int      `json:"content-length"`
	StatusCode    int      `json:"status-code"`
	ResponseTime  string   `json:"response-time"`
	Failed        bool     `json:"failed"`
}
