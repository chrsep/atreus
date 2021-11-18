package main

import (
	"bytes"
	"encoding/json"
	"os/exec"
	"strings"
	"time"
)

type HTTPXResult struct {
	Timestamp      time.Time `json:"timestamp"`
	Request        string    `json:"request"`
	ResponseHeader string    `json:"response-header"`
	Scheme         string    `json:"scheme"`
	Port           string    `json:"port"`
	Path           string    `json:"path"`
	BodySha256     string    `json:"body-sha256"`
	HeaderSha256   string    `json:"header-sha256"`
	A              []string  `json:"a"`
	Cnames         []string  `json:"cnames"`
	Url            string    `json:"url"`
	Input          string    `json:"input"`
	Title          string    `json:"title"`
	Webserver      string    `json:"webserver"`
	ResponseBody   string    `json:"response-body"`
	ContentType    string    `json:"content-type"`
	Method         string    `json:"method"`
	Host           string    `json:"host"`
	ContentLength  int       `json:"content-length"`
	StatusCode     int       `json:"status-code"`
	ResponseTime   string    `json:"response-time"`
	Failed         bool      `json:"failed"`
	Technologies   []string  `json:"technologies"`
}

func scanServices(domains []string) ([]HTTPXResult, error) {
	cmd := exec.Command("httpx", "-json", "-irr", "-tech-detect", "-silent")
	cmd.Stdin = strings.NewReader(strings.Join(domains, "\n"))

	var err bytes.Buffer
	var out bytes.Buffer
	cmd.Stderr = &err
	cmd.Stdout = &out

	_ = cmd.Run()

	var results []HTTPXResult
	for _, line := range strings.Split(out.String(), "\n") {
		if line == "" {
			continue
		}

		var r HTTPXResult
		if err := json.Unmarshal([]byte(line), &r); err != nil {
			return nil, err
		}
		results = append(results, r)
	}

	return results, nil
}
