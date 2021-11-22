package log

import "go.uber.org/zap"

var logger *zap.Logger

func Setup() func() {
	logger, _ = zap.NewProduction()
	return func() {
		err := logger.Sync()
		if err != nil {
			panic(err)
		}
	}
}

func Error(message string, err error) {
	logger.Error(message, zap.Error(err))
}

func Info(message string) {
	logger.Info(message)
}
