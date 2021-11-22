package db

import (
	"context"
	"github.com/prisma/prisma-client-go/runtime/transaction"
)

var db *DB

type DB struct {
	*PrismaClient
	ctx context.Context
}

func Setup() func() {
	db = &DB{NewClient(), context.Background()}
	if err := db.Connect(); err != nil {
		panic(err)
	}
	return func() {
		if err := db.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}
}

func FindRootDomains() ([]DomainModel, error) {
	return db.Domain.FindMany(
		Domain.Confirmed.Equals(true),
		Domain.RootDomainName.IsNull(),
	).Exec(db.ctx)
}

func InsertSubDomains(domains []string, companyId int, rootDomain string) error {
	var ops []transaction.Param
	for i := range domains {
		if domains[i] != rootDomain {
			query := db.Domain.
				UpsertOne(Domain.Name.Equals(domains[i])).
				Update(Domain.Confirmed.Set(true)).
				Create(
					Domain.Name.Set(domains[i]),
					Domain.Company.Link(
						Company.ID.Equals(companyId),
					),
					Domain.RootDomain.Link(
						Domain.Name.Equals(rootDomain),
					),
					Domain.Confirmed.Set(true),
				).Tx()
			ops = append(ops, query)
		}
	}
	return db.Prisma.Transaction(ops...).Exec(db.ctx)
}

//func FindAllDomains() ([]DomainModel, error) {
//	return db.Domain.FindMany(
//		Domain.Confirmed.Equals(true),
//	).Exec(db.ctx)
//}
//
//func UpsertService(service ServiceModel) (*ServiceModel, error) {
//	return db.Service.UpsertOne(
//		Service.PortDomainName(
//			Service.Port.Equals(service.Port),
//			Service.DomainName.Equals(service.DomainName),
//		),
//	).Update(
//		Service.Name.Set(service.Name),
//		Service.ARecords.Set(service.ARecords),
//		Service.CnameRecords.Set(service.CnameRecords),
//	).Create(
//		Service.Port.Set(service.Port),
//		Service.Name.Set(service.Name),
//		Service.Description.Set(""),
//		Service.Domain.Link(
//			Domain.Name.Equals(service.DomainName),
//		),
//		Service.ARecords.Set(service.ARecords),
//		Service.CnameRecords.Set(service.CnameRecords),
//	).Exec(db.ctx)
//}
//
//func UpsertProbeResponse(response ProbeResponseModel, servicePort int, serviceDomainName string) (*ProbeResponseModel, error) {
//	return db.ProbeResponse.UpsertOne(
//		ProbeResponse.BodySHA.Equals(response.BodySHA),
//	).Create(
//		ProbeResponse.BodySHA.Set(response.BodySHA),
//		ProbeResponse.URL.Set(response.URL),
//		ProbeResponse.Host.Set(response.Host),
//		ProbeResponse.Method.Set(response.Method),
//		ProbeResponse.Scheme.Set(response.Scheme),
//		ProbeResponse.Webserver.Set(response.Webserver),
//		ProbeResponse.Timestamp.Set(response.Timestamp),
//		ProbeResponse.Title.Set(response.Title),
//		ProbeResponse.Header.Set(response.Header),
//		ProbeResponse.Body.Set(response.Body),
//		ProbeResponse.StatusCode.Set(response.StatusCode),
//		ProbeResponse.ContentType.Set(response.ContentType),
//		ProbeResponse.Path.Set(response.Path),
//		ProbeResponse.ResponseTime.Set(response.ResponseTime),
//		ProbeResponse.Service.Link(
//			Service.PortDomainName(
//				Service.Port.Equals(servicePort),
//				Service.DomainName.Equals(serviceDomainName),
//			),
//		),
//	).Update(
//		ProbeResponse.BodySHA.Set(response.BodySHA),
//		ProbeResponse.URL.Set(response.URL),
//		ProbeResponse.Host.Set(response.Host),
//		ProbeResponse.Method.Set(response.Method),
//		ProbeResponse.Scheme.Set(response.Scheme),
//		ProbeResponse.Webserver.Set(response.Webserver),
//		ProbeResponse.Timestamp.Set(response.Timestamp),
//		ProbeResponse.Title.Set(response.Title),
//		ProbeResponse.Header.Set(response.Header),
//		ProbeResponse.Body.Set(response.Body),
//		ProbeResponse.StatusCode.Set(response.StatusCode),
//		ProbeResponse.ContentType.Set(response.ContentType),
//		ProbeResponse.Path.Set(response.Path),
//		ProbeResponse.ResponseTime.Set(response.ResponseTime),
//		ProbeResponse.Service.Link(
//			Service.PortDomainName(
//				Service.Port.Equals(servicePort),
//				Service.DomainName.Equals(serviceDomainName),
//			),
//		),
//	).Exec(db.ctx)
//}
//
//func UpsertTech(techs []string, probeResponseBodySHA string) error {
//	ops := make([]transaction.Param, len(techs))
//	for i, tech := range techs {
//		op := db.Tech.UpsertOne(
//			Tech.Name.Equals(tech),
//		).Create(
//			Tech.Name.Set(tech),
//			Tech.ProbeResponse.Link(
//				ProbeResponse.BodySHA.Equals(probeResponseBodySHA),
//			),
//		).Update(
//			Tech.Name.Set(tech),
//			Tech.ProbeResponse.Link(
//				ProbeResponse.BodySHA.Equals(probeResponseBodySHA),
//			),
//		).Tx()
//		ops[i] = op
//	}
//	return db.Prisma.Transaction(ops...).Exec(db.ctx)
//}
