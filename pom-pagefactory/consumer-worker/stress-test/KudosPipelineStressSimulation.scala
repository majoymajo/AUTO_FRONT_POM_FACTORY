// Gatling stress simulation: sends Kudos to Producer API to load the RabbitMQ + Consumer pipeline.
// Usage: Add io.gatling:gatling-maven-plugin to a module, place this under src/test/resources/gatling/simulations,
//        then run: mvn gatling:test -Dgatling.simulationClass=KudosPipelineStressSimulation
// Prerequisites: Producer API running on localhost:8082, RabbitMQ and Consumer Worker running.

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class KudosPipelineStressSimulation extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8082")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")

  val kudosPublish = scenario("Publish Kudos")
    .exec(
      http("POST /api/v1/kudos")
        .post("/api/v1/kudos")
        .body(StringBody("\"Stress test kudo payload\""))
        .asJson
        .check(status.is(202))
    )

  setUp(
    kudosPublish.inject(
      rampUsersPerSec(1).to(20).during(30.seconds),
      constantUsersPerSec(20).during(60.seconds)
    )
  ).protocols(httpProtocol)
}
